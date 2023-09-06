import { useQuery } from "react-query"
import { fetchProjectPerUserId } from "../../Utils/Queries"
import {CreateProjectModal} from "../assets/CreateProjectModal.jsx"
import { JoinProjectModal } from "../assets/JoinProjectModal"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../customHooks/useAuth"


const UserHomePage = () => {
  const {user} = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const {isLoading,error,data} = useQuery('projects',() => fetchProjectPerUserId(),{
    onSuccess: (data) => {
      setProjects(data.project)
    }
  })
  const handleClick = (projectId) => {
    navigate(`/ProjectDetails/${projectId}`);
  }
  if (error) return <p>error</p>
  if (isLoading) return <p>loading</p>
  return (
    <div>
      UserHomePage
      <br/>
      this page will only be accessible once user logs in.
      <br/>
      This page will contain all the projects 
      <br/>
      create a project:
      <CreateProjectModal projects={projects} setProjects={setProjects} ></CreateProjectModal>
      <br/>
      join a project:
      <JoinProjectModal projects={projects} setProjects={setProjects}></JoinProjectModal>
      <br/>
      your projects:
      {projects.map((project,i) => {
        return (
          <div key={i}>
            <button onClick={() => handleClick(project._id)} >{project.projectName}</button>
          </div>
        )
      })}
      
    </div>
  )
  }

export default UserHomePage