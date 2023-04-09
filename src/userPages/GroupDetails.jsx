import { Button } from "@mui/material"
import { useQuery } from "react-query"
import { fetchGroupById } from "../../Utils/Queries"
import { useLocation } from "react-router-dom"
import { Navigate } from "react-router-dom"
import { returnSessionObject, isUserLeader } from "../../Utils/Utils"


const GroupDetails = () => {
  const {state} = useLocation();
  {if (!state) return <Navigate to="/UserHome"/>}
  const { groupId } = state;
  const {isLoading,error,data} = useQuery('group',() => fetchGroupById(groupId))
  if (!isLoading) {
    console.log("isleader: ", isUserLeader(data.group.leader._id))
  }
  if (error) return <p>error</p>
  if (isLoading) return <p>loading</p>
  return (
    <div>
      <p>Group name: {data.group.groupName}</p>
      {data.group.description && <p>Group description: {data.group.description}</p>}
      <h2>MEMBERS:</h2>
      {data.group.members.map((member,i) => {
        return (
          <div key={i}>
            <h3>member {i+1}</h3>
            <p>Member name: {member.firstName} {member.lastName}</p>
            <p>Member email: {member.email}</p>
          </div>
        )
      })}
      { isUserLeader(data.group.leader._id) && <Button variant="text" type="submit">Create meetup</Button>}
    </div>
  )
  }

export default GroupDetails