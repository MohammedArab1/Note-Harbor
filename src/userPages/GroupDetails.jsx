import { Button } from "@mui/material"
import { useQuery} from "react-query"
import { fetchGroupById } from "../../Utils/Queries"
import { useNavigate, useParams } from "react-router-dom"
import { isUserLeader } from "../../Utils/Utils"
import { useAuth } from "../../customHooks/useAuth"
import { useMutations } from "../../customHooks/useMutations"
import { useState } from "react"
import ConfirmationPopup from "../assets/ConfirmationPopup"
import { CreateMeetupModal } from "../assets/CreateMeetupModal"


const GroupDetails = () => {
  const {deleteGroupMutation,invalid, leaveGroupMutation} = useMutations()
  const {user} = useAuth()
  const {groupId} = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [meetups, setMeetups] = useState([])
  const groupLeaderLeaveMessage = "Are you sure you want to leave this group? Since you are the group leader, a random member will be appointed group leader after you leave."
  const groupLeaderDeleteMessage = "Are you sure you want to delete this group?"

  const handleLeaveGroup = (userToBeDeletedId) => {
    const newGroup = {...group, members: group.members.filter(member => member._id !== userToBeDeletedId)}
    if (group.leader._id===userToBeDeletedId) {
      const newLeader = newGroup.members[Math.floor(Math.random() * newGroup.members.length)];
      newGroup.leader = newLeader
    }
    leaveGroupMutation.mutate({groupId:newGroup._id,newGroup})
  }
  
  const {isLoading,error,data} = useQuery('group',() => fetchGroupById(groupId),{
    onSuccess: (data) => {
      if (data.group===null) {
        return navigate('/UserHome')
      }
      const members = data.group.members
      const userExists = members.some(member => member._id === user.id)
      if (!userExists) {
        return navigate('/UserHome')
      }
      setGroup(data.group)
    },
    onError: (error) => {
      navigate('/UserHome')
    },
    retry: false,
    refetchOnReconnect: 'Always'
  })
  if (error) return <p>error</p>
  if (isLoading) return <p>loading</p>
  if (data.group===null) return <p>group does not exist</p>
  return (
    <div>
      {invalid.isInvalid && <p>{invalid.message}</p>}
      <p>Group name: {data.group.groupName}</p>
      {data.group.description && <p>Group description: {data.group.description}</p>}
      <p>Access Code: {data.group.accessCode}</p>
      <p>group id: {data.group._id}</p>
      <p>---------------------------------------------------------------</p>
      <h2>OTHER MEMBERS:</h2>
      {data.group.members.filter(member => member._id !== user.id).map((member,i) => {
        return (
          <div key={i}>
            <h3>member {i+1}</h3>
            <p>Member name: {member.firstName} {member.lastName}</p>
            <p>Member email: {member.email}</p>
            <p>Member id: {member._id}</p>
            {isUserLeader(data.group.leader._id) && <Button variant="text" type="button" onClick={() => handleLeaveGroup(member._id)}>Kick user from group</Button>}
          </div>
        )})}
      <p>---------------------------------------------------------------</p>
      <h2>Me:</h2>
      <p>My name: {user.firstName} {user.lastName}</p>
      <p>My email: {user.email}</p>
      <p>My id: {user.id}</p>
      {/* { isUserLeader(data.group.leader._id) && <Button variant="text" type="submit">Create meetup</Button>} */}
      { isUserLeader(data.group.leader._id) && <CreateMeetupModal meetups={meetups} setMeetups={setMeetups} groupId={groupId}></CreateMeetupModal>}
      { isUserLeader(data.group.leader._id) && <ConfirmationPopup name="Delete group" message={groupLeaderDeleteMessage} onConfirm={() => deleteGroupMutation.mutate(groupId)}></ConfirmationPopup>}
      <button onClick={() => navigate(-1)}>go back</button>
      <br/>
      { isUserLeader(data.group.leader._id) ?  
      <ConfirmationPopup name="Leave group" message={groupLeaderLeaveMessage} onConfirm={() => handleLeaveGroup(user.id)}></ConfirmationPopup> :
      <Button variant="text" type="button" onClick={() => handleLeaveGroup(user.id)}>Leave group</Button> 
      }
    </div>
  )
  }

export default GroupDetails