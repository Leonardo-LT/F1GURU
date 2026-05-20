import {
  getFirestore,
  runTransaction,
  doc,
  writeBatch,
} from "firebase/firestore";
import { fApp } from "../app";
import {
  collection,
  getDocs,
  query,
  where,
  documentId,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  createResource,
  createSignal,
  Show,
  For,
  Suspense,
  createEffect,
  ErrorBoundary,
} from "solid-js";
import CreateJoinModal from "../components/createJoinModal";
import GroupCard from "../components/groupCard";
import {
  fetchConstructorsStandings,
  getTeamStanding,
} from "../utility/fetchConstructorsStandings";
import {
  fetchStandings,
  getDriverPosition,
} from "../utility/fetchDriversStandings";
import { numberDriverMapping, numberTeamMapping } from "../utility/mapping";
import GroupMemberCard from "../components/groupMemberCard";
import { getDriverFromFullName } from "~/utility/getDriversFromTeamName";

const db = getFirestore(fApp);

const fetchGroups = async () => {
  await getAuth().authStateReady();
  const userId = getAuth().currentUser ? getAuth().currentUser.uid : null;
  if (userId == null) return;

  const userGroupsSnapshot = await getDocs(
    collection(db, "users", userId, "myGroups"),
  );
  const groupIds = userGroupsSnapshot.docs.map((doc) => doc.id);

  if (groupIds.length === 0) {
    return [];
  }

  const groupsQuery = query(
    collection(db, "groups"),
    where(documentId(), "in", groupIds),
  );

  const groups = await getDocs(groupsQuery);

  const res = await Promise.all(
    groups.docs.map(async (doc) => {
      let members = await getDocs(collection(db, "groups", doc.id, "members"));
      members = members.docs.map((memberDoc) => {
        let data = { ...memberDoc.data() };
        data.drivers = data.drivers
          ? data.drivers.map((driver) => numberDriverMapping[driver] || driver)
          : [];
        data.teams = data.teams
          ? data.teams.map((team) => numberTeamMapping[team] || team)
          : [];
        return data;
      });

      return {
        id: doc.id,
        groupName: doc.data().groupName,
        members: members,
      };
    }),
  );
  console.log(res);
  return res;
};

const calcMemberPoints = (member, driverStandings, teamStandings) => {
  if (!member) return 0;

  const DriverStandings = Array.isArray(driverStandings) ? driverStandings : [];
  const TeamStandings = Array.isArray(teamStandings) ? teamStandings : [];

  const driverPoints = Array.isArray(member.drivers)
    ? member.drivers.reduce((acc, driver) => {
        const driverNumber = getDriverFromFullName(driver).driver_number;
        const standing = getDriverPosition(driverNumber, DriverStandings);
        return acc + Number(standing?.points_current ?? 0);
      }, 0)
    : 0;

  const teamPoints = Array.isArray(member.teams)
    ? member.teams.reduce((acc, team) => {
        const standing = getTeamStanding(team, TeamStandings);
        return acc + Number(standing?.points_current ?? 0);
      }, 0)
    : 0;

  return driverPoints + teamPoints;
};

const checkCurrUser = async () => {
  await getAuth().authStateReady();
  return getAuth().currentUser != null;
};

const FantaF1 = () => {
  const [isShowModal, setShowModal] = createSignal(false);
  const [isCreate, setIsCreate] = createSignal(false);
  const [groups, { refetch, mutate }] = createResource(fetchGroups);
  const [sideGroup, setSideGroup] = createSignal(null);
  const [driverStandings] = createResource(fetchStandings);
  const [teamStandings] = createResource(fetchConstructorsStandings);
  const [isLogged, { refetch: loggedRefetch, mutate: loggedMutate }] =
    createResource(checkCurrUser);

  onAuthStateChanged(getAuth(), () => loggedMutate(() => getAuth.currentUser));

  const quitGroup = async (groupId) => {
    try {
      const uid = getAuth().currentUser.uid;
      const batch = writeBatch(db);

      const userGroupRef = doc(db, "users", uid, "myGroups", groupId);
      batch.delete(userGroupRef);

      const groupMemberRef = doc(db, "groups", groupId, "members", uid);
      batch.delete(groupMemberRef);

      await batch.commit();

      const newGroups = groups().filter((group) => group.id !== groupId);
      mutate(newGroups);
    } catch (error) {
      alert("Error quitting group: " + error.message);
    }
  };

  createEffect(() => {
    setSideGroup(groups() && groups().length > 0 ? groups()[0] : null);
  });

  return (
    <div class="py-6 h-full">
      <Show
        when={isLogged()}
        fallback={
          <div class="p-8 text-center text-white">
            Log in to access this section
          </div>
        }
      >
        <div class="grid grid-cols-1 md:grid-cols-8 md:grid-rows-[5fr_3fr] gap-2.5 h-full">
          <div class="widget col-span-1 md:col-span-5">
            <div class="w-full flex flex-row gap-4 justify-between items-center px-4 min-h-fit">
              <div class="w-full sm:w-[65%] text-center sm:text-start">
                <h2 class="text-3xl font-extrabold">ACTIVE GROUPS</h2>
              </div>

              <div class="h-full items-center justify-end hidden text-center sm:flex sm:w-[30%]">
                <p class="text-center">GROUP IDs</p>
              </div>
            </div>

            <div class="pt-4 pb-10 overflow-y-auto scroll-smooth h-full flex flex-col gap-4">
              <ErrorBoundary
                fallback={(err, reset) => (
                  <div class="h-full flex flex-col items-center justify-center text-gray-500 font-semibold italic gap-3">
                    <p>Failed to load groups</p>
                    <button
                      class="button"
                      onClick={() => {
                        refetch();
                        reset();
                      }}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              >
                <Suspense
                  fallback={
                    <div class="h-full flex items-center justify-center">
                      <p class="animate-pulse text-xl">
                        Loading your groups...
                      </p>
                    </div>
                  }
                >
                  <For each={groups()}>
                    {(group, idx) => (
                      <GroupCard
                        group={group}
                        setGroup={(g) => setSideGroup(g)}
                        quitGroup={quitGroup}
                      />
                    )}
                  </For>
                </Suspense>
              </ErrorBoundary>

              <div
                class="widget min-h-fit flex-1 flex justify-center items-center bg-gray-400/10 hover:bg-black/20 transition-all cursor-pointer"
                onClick={() => {
                  setShowModal(true);
                  setIsCreate(false);
                }}
              >
                <div class="flex flex-col items-center gap-2">
                  <p class="font-bold text-xl">JOIN A GROUP</p>
                  <i class="fa-solid fa-plus text-white text-3xl"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="widget col-span-1 md:col-span-3">
            <h3 class="font-bold text-xl truncate">
              {sideGroup() ? sideGroup().groupName : "GROUP"}
            </h3>
            <Show
              when={sideGroup()}
              fallback={
                <div class="h-full flex flex-col justify-center p-4 text-center text-gray-500 font-semibold italic">
                  No group found.
                </div>
              }
            >
              <div class="flex flex-col gap-4">
                <h4 class="text-gray-400">
                  <span class="text-white font-bold">ID:</span>{" "}
                  {sideGroup() ? sideGroup().id : "nulla"}
                </h4>
                <div class="flex flex-col gap-2">
                  <For each={sideGroup().members}>
                    {(member, idx) => (
                      <GroupMemberCard
                        member={member}
                        points={calcMemberPoints(
                          member,
                          driverStandings(),
                          teamStandings(),
                        )}
                      />
                    )}
                  </For>
                </div>
              </div>
            </Show>
          </div>

          <div
            onclick={() => {
              setShowModal(true);
              setIsCreate(true);
            }}
            class={`widget col-span-1 md:col-span-4 bg-[url(/images/createGroupBg.webp)] bg-center bg-cover bg-gray-700 hover:bg-gray-800 transition-all bg-blend-multiply filter grayscale cursor-pointer`}
          >
            <h3 class="font-extrabold text-3xl">CREATE A GROUP</h3>
            <div class="h-full flex flex-col items-center justify-center">
              <i class="fa-solid fa-plus text-white fa-5x"></i>
            </div>
            <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/10"></div>
          </div>

          <div
            onclick={() => {
              setShowModal(true);
              setIsCreate(false);
            }}
            class="widget col-span-1 md:col-span-4 bg-[url(/images/joinGroupBg.webp)] bg-center bg-cover bg-gray-700 hover:bg-gray-800 transition-all bg-blend-multiply filter grayscale cursor-pointer"
          >
            <h3 class="font-extrabold text-3xl">JOIN GROUP</h3>

            <div class="h-full flex flex-col items-center justify-center">
              <i class="fa-solid fa-plus text-white fa-5x"></i>
            </div>
            <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/10"></div>
          </div>
        </div>
      </Show>

      <Show when={isShowModal()}>
        <CreateJoinModal
          isCreate={isCreate}
          setShowModal={setShowModal}
          groups={groups}
          addGroup={mutate}
          refetch={refetch}
        />
      </Show>
    </div>
  );
};

export default FantaF1;
