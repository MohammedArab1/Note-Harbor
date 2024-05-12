import { useNavigate, Link } from "react-router-dom"
import {useAuth} from "../../customHooks/useAuth"
import { isOfflineMode } from "../../Utils/Utils"
import { Button, Container, Group, Burger, Text, Divider, Menu, Center, Transition, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from '../../styles/NavBar.module.css'
import { useState } from "react";
import { IconChevronDown } from '@tabler/icons-react';
import {motion} from 'framer-motion'
import { LoginButton } from "../assets/LoginButton";
import { RegisterButton } from "../assets/RegisterButton";

const NavigationBar= () => {
  const {user, logout} = useAuth()
  const navigate = useNavigate()
  // const onOfflineButtonClick = (e) => {
  //   e.preventDefault()
  //   const offlineMode = localStorage.getItem("offlineMode");
  //   const isOfflineMode = offlineMode === "true";
  //   localStorage.setItem("offlineMode", !isOfflineMode);
  //   if (!isOfflineMode) {
  //     logout()
  //     navigate("/userHome");
  //   }
  //   else {
  //     navigate("/login");
  //   }
  // }

  const links = [
    { link: '/UserHome', label: 'Home' },
  ];

  const [burgerOpened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  // const items = links.map((link) => (
  //   <a
  //     key={link.label}
  //     href={link.link}
  //     className={classes.link}
  //     data-active={active === link.link || undefined}
  //     onClick={(event) => {
  //       event.preventDefault();
  //       setActive(link.link);
  //       onGenericClick(event,link.link)
  //     }}
  //   >
  //     {link.label}
  //   </a>
  // ));
  const loggedInNavBar = () => {
    return (
      // <div>
      //   <Button onClick={(e) => {onGenericClick(e,'/UserHome')}}>UserHome</Button>
      //   {!isOfflineMode()&&<Button onClick={(e) => {onLogoutClick(e)}}>Logout</Button>}
      //   {isOfflineMode() && <Button onClick={(e) => {onOfflineButtonClick(e)}}>No Longer Offline</Button>}
      // </div>
        <header className={classes.header}>
        <div className={classes.inner}>
          <Group gap={1} visibleFrom="xs">
            <Text onClick={(e) => {onGenericClick(e,'/')}} mr={10}>Note Harbor</Text> 
            {/* <Divider orientation="vertical" mr={10} ml={10} />
            {items} */}
          </Group>
          <Group visibleFrom="sm">
              {/* <Button onClick={(e) => {onGenericClick(e,'/login')}} variant="default">Log in</Button>
              <Divider orientation="vertical" mr={5} ml={5} />
              <Button onClick={(e) => {onGenericClick(e,'/register')}}>Sign up</Button> */}
            <Menu key={user.firstName + ' ' +user.lastName} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
              <Menu.Target>
                <a
                  href='#1'
                  className={classes.link}
                  onClick={(event) => event.preventDefault()}
                >
                  <Center>
                    <span className={classes.linkLabel}>{user.firstName + ' ' + user.lastName}</span>
                    <IconChevronDown size="0.9rem" stroke={1.5} />
                  </Center>
                </a>
              </Menu.Target>
              <Menu.Dropdown>
                {[
                  <Menu.Item key={'/'} onClick={(e) => {onLogoutClick(e)}}>Logout</Menu.Item>
                ]}
              </Menu.Dropdown>
            </Menu>
          </Group>
          <Burger opened={burgerOpened} onClick={toggle} hiddenFrom="xs" size="sm" />
          <Drawer
            opened={burgerOpened}
            onClose={toggle}
            size="80%"
            padding="md"
            title="Navigation"
            hiddenFrom="sm"
            zIndex={1000000}
            // keepMounted={true}
          >
            <Group>
              {/* <LoginButton variant="default" addFunctions={[toggle]}/>
              <Divider orientation="vertical" mr={5} ml={5} />
              <RegisterButton variant="light" addFunctions={[toggle]}/> */}
              <Button component={Link} to={"/UserHome"} variant="default" onClick={toggle}>Home</Button>
              <Divider orientation="vertical" mr={5} ml={5} />
              <Button variant="light" onClick={(e) => {
                onLogoutClick(e)
                toggle()
                }}>
                  Logout
              </Button>
            </Group>
          </Drawer>
        </div>
        </header>
    )
  }

  const loggedOutNavBar = () => {
    return (
      // <div>
      //   <Button color="appBlue.2" onClick={(e) => {onGenericClick(e,'/login')}}>login</Button>
      //   <Button variant="light" onClick={(e) => {onGenericClick(e,'/register')}}>Register</Button>
      //   <Button onClick={(e) => {onOfflineButtonClick(e)}}>Offline</Button>
      // </div>
      <header className={classes.header}>
        <div className={classes.inner}>
          <Group gap={1} visibleFrom="xs">
            <Text onClick={(e) => {onGenericClick(e,'/')}} mr={10}>Note Harbor</Text> 
            {/* <Divider orientation="vertical" mr={10} ml={10} />
            {items} */}
          </Group>
          <Group visibleFrom="sm">
              <LoginButton variant="default"/>
              <Divider orientation="vertical" />
              {/* <Button onClick={(e) => {onRegisterClick(e)}}>Sign up</Button> */}
              <RegisterButton variant='light' addFunctions={[toggle]}/>
          </Group>
          <Burger opened={burgerOpened} onClick={toggle} hiddenFrom="xs" size="sm" />
          <Drawer
            opened={burgerOpened}
            onClose={toggle}
            size="100%"
            padding="md"
            title="Note Harbor"
            hiddenFrom="xs"
            zIndex={1000000}
            keepMounted={true}
          >
            <Group>
              <LoginButton variant="default" addFunctions={[toggle]}/>
              <Divider orientation="vertical" mr={5} ml={5} />
              <RegisterButton variant="light" addFunctions={[toggle]}/>
            </Group>
          </Drawer>
        </div>
      </header>
    )
  }

  // const onRegisterClick = (e) => {
  //   e.preventDefault()
  //   localStorage.setItem('offlineMode', null)
  //   navigate('/register')
  // }

  const onLogoutClick = (e) => {
    e.preventDefault()
    logout()
    navigate('/')
  }

  const onGenericClick = (e, path) => {
    e.preventDefault()
    navigate(path)
  }
  // if ((localStorage.getItem('user') && localStorage.getItem('user') !== 'null') && !user) {
  //   return <div>loading...</div>
  // }
  return (
    <div>
      { (user) ? 
        <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}>
          {loggedInNavBar()}
        </motion.div>
      : 
      <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}>
          {loggedOutNavBar()}
        </motion.div>
      }
    </div>
  )
}



export default NavigationBar