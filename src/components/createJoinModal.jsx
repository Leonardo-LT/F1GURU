import { Show, For } from "solid-js";
import { Portal } from "solid-js/web";
import { driverNumberMapping, teamNumberMapping } from "../utility/mapping";
import { collection, getFirestore } from "firebase/firestore";
import { fApp } from "../app";
import { doc, writeBatch, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore(fApp);

const joinGroup = async (groupId, userName, drivers, teams) => {
  await getAuth().authStateReady();
  const userId = getAuth().currentUser.uid;
  drivers = drivers.map((driver) => driverNumberMapping[driver]);
  teams = teams.map((team) => teamNumberMapping[team]);

  const groupMemberRef = doc(db, "groups", groupId, "members", userId);

  const memberSnap = await getDoc(groupMemberRef);

  if (memberSnap.exists()) {
    throw new Error("Already in this group.");
  }

  const batch = writeBatch(db);

  batch.set(
    groupMemberRef,
    {
      username: userName,
      drivers: drivers,
      teams: teams,
    },
    { merge: true },
  );

  const userGroupRef = doc(db, "users", userId, "myGroups", groupId);
  batch.set(userGroupRef, {});

  await batch.commit();
};

const createGroup = async (groupName, userName, drivers, teams) => {
  const userId = getAuth().currentUser.uid;
  const batch = writeBatch(db);
  drivers = drivers.map((driver) => driverNumberMapping[driver]);
  teams = teams.map((team) => teamNumberMapping[team]);

  const groupRef = doc(collection(db, "groups"));
  batch.set(groupRef, {
    groupName: groupName,
  });

  const memberRef = doc(db, "groups", groupRef.id, "members", userId);
  batch.set(
    memberRef,
    {
      username: userName,
      drivers: drivers,
      teams: teams,
    },
    { merge: true },
  );

  const myGroupsRef = doc(db, "users", userId, "myGroups", groupRef.id);
  batch.set(myGroupsRef, {});

  await batch.commit();
  return groupRef.id;
};

const CreateJoinModal = (props) => {
  const buttonText = () => (props.isCreate() ? "Create Group" : "Join Group");

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const inData = new FormData(e.currentTarget);
    let [groupName, username, drivers, teams] = [
      inData.get("groupName"),
      inData.get("username"),
      [inData.get("driversInput1"), inData.get("driversInput2")],
      [inData.get("teamInput1"), inData.get("teamInput2")],
    ];

    try {
      const res = await createGroup(groupName, username, drivers, teams);

      props.addGroup([
        ...props.groups(),
        {
          id: res,
          groupName: groupName,
          members: [{ username: username, drivers: drivers, teams: teams }],
        },
      ]);
      return res;
    } catch (err) {
      console.log(err);
      alert(err);
      return null;
    } finally {
      props.setShowModal(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();

    const inData = new FormData(e.currentTarget);
    let [groupId, username, drivers, teams] = [
      inData.get("groupId"),
      inData.get("username"),
      [inData.get("driversInput1"), inData.get("driversInput2")],
      [inData.get("teamInput1"), inData.get("teamInput2")],
    ];

    try {
      const res = await joinGroup(groupId, username, drivers, teams);
      props.refetch();
      return res;
    } catch (err) {
      alert(err);
      return null;
    } finally {
      props.setShowModal(false);
    }
  };

  return (
    <Portal useShadow={false} mount={document.querySelector("main")}>
      <div class="fixed inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
        <div class="widget flex flex-col gap-5 w-[40vw]">
          <i
            class="relative top-0 left-[97%] fa-solid fa-x text-primary text-xl cursor-pointer hover:text-primary/50"
            onclick={() => props.setShowModal(false)}
          ></i>
          <h2 class="text-white text-center text-xl font-bold text">
            {props.isCreate() ? "CREATE" : "JOIN"} A{" "}
            <span class="text-primary">GROUP</span> AND{" "}
            <span class="text-primary">PICK</span>
          </h2>
          <form
            id="form"
            class="flex flex-col gap-4"
            onSubmit={props.isCreate() ? handleCreateSubmit : handleJoinSubmit}
          >
            <Show when={props.isCreate()}>
              <div>
                <label class="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">
                  GROUP NAME
                </label>
                <input
                  name="groupName"
                  type="text"
                  class="auth-input"
                  placeholder="Group Name"
                  required
                />
              </div>
            </Show>

            <Show when={!props.isCreate()}>
              <div>
                <label class="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">
                  GROUP ID
                </label>
                <input
                  name="groupId"
                  type="text"
                  class="auth-input"
                  placeholder="Group Id"
                  required
                />
              </div>
            </Show>

            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">
                USERNAME
              </label>
              <input
                name="username"
                type="text"
                class="auth-input"
                placeholder="Username"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">
                SELECT DRIVERS
              </label>
              <div class="flex flex-col gap-2">
                <select
                  name="driversInput1"
                  class="auth-input"
                  placeholder="Select driver"
                  required
                >
                  <For each={Object.keys(driverNumberMapping)}>
                    {(driver, index) => (
                      <option value={driver}>{driver}</option>
                    )}
                  </For>
                </select>

                <select
                  name="driversInput2"
                  class="auth-input"
                  placeholder="Select driver"
                  required
                >
                  <For each={Object.keys(driverNumberMapping)}>
                    {(driver, index) => (
                      <option value={driver}>{driver}</option>
                    )}
                  </For>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">
                SELECT TEAMS
              </label>
              <div class="flex flex-col gap-2">
                <select
                  name="teamInput1"
                  class="auth-input"
                  placeholder="Select team"
                  required
                >
                  <For each={Object.keys(teamNumberMapping)}>
                    {(driver, index) => (
                      <option value={driver}>{driver}</option>
                    )}
                  </For>
                </select>

                <select
                  name="teamInput2"
                  class="auth-input"
                  placeholder="Select team"
                  required
                >
                  <For each={Object.keys(teamNumberMapping)}>
                    {(driver, index) => (
                      <option value={driver}>{driver}</option>
                    )}
                  </For>
                </select>
              </div>
            </div>

            <button class="auth-btn" type="submit">
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default CreateJoinModal;
