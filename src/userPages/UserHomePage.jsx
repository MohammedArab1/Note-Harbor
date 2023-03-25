import { useQuery } from "react-query"
import { fetchGroupPerUserId } from "../../Utils/Queries"
import { returnSessionObject } from "../../Utils/Utils"


const UserHomePage = () => {
  const {isLoading,error,data} = useQuery('groups',() => fetchGroupPerUserId(returnSessionObject().id))
  if (error) return <p>error</p>
  if (isLoading) return <p>loading</p>
  return (
    <div>
      UserHomePage
      <br/>
      this page will only be accessible once user logs in.
      <br/>
      This page will contain all the groups as well as the next upcoming meetup (also if there are any meetups they haven't given availabilities for then it will show)
      <br/>
      your groups:

      {data.group.map((group,i) => {
        return (
          <div key={i}>
            <p>{group.groupName}</p>
          </div>
        )
      })}
    </div>
  )
  }

export default UserHomePage