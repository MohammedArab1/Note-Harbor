import { useQuery } from "react-query"
import { fetchGroupPerUserId } from "../../Utils/Queries"
import { returnSessionObject } from "../../Utils/Utils"


const UserHomePage = () => {
  // const {isLoading,error,data} = useQuery('groups',() => fetchGroupPerUserId(returnSessionObject().id))
  // console.log(data)
  return (
    <div>
      UserHomePage
      <br/>
      this page will only be accessible once user logs in.
      <br/>
      This page will contain all the groups as well as the next upcoming meetup (also if there are any meetups they haven't given availabilities for then it will show)
      <br/>
      your groups:
      {/* {data} */}
    </div>
  )
}

export default UserHomePage