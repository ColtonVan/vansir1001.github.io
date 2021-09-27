import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useState, useEffect } from "react";
import qs from "qs";
import { cleanObject } from "../../utils";
const apiUrl = process.env.REACT_APP_API_URL;
console.log(qs.stringify({ name: "zs", age: 18 }));

export const ProjectListScreen = () => {
  const [param, setParam] = useState({ name: "", personId: "" });
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  useEffect(() => {
    fetch(`${apiUrl}/projects?${qs.stringify(cleanObject(param))}`).then(
      async (res) => {
        if (res.ok) {
          setList(await res.json());
        }
      }
    );
    fetch(`${apiUrl}/users`).then(async (res) => {
      if (res.ok) {
        setUsers(await res.json());
      }
    });
  }, [param]);
  return (
    <div>
      <SearchPanel param={param} setParam={setParam} users={users} />
      <List list={list} users={users} />
    </div>
  );
};
