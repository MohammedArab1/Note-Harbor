import { Button } from "@mui/material"
import { useQuery } from "react-query"
import { fetchGroupById } from "../../Utils/Queries"
import { useLocation } from "react-router-dom"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { isUserLeader } from "../../Utils/Utils"
import { useAuth } from "../../customHooks/useAuth"


const GroupDetails = () => {
  const {user} = useAuth()
  const {groupId} = useParams()
  const navigate = useNavigate()
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
      <p>Group name: {data.group.groupName}</p>
      {data.group.description && <p>Group description: {data.group.description}</p>}
      <p>Access Code: {data.group.accessCode}</p>
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
      <button onClick={() => navigate(-1)}>go back</button>
    </div>
  )
  }

export default GroupDetails