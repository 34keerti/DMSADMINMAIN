import * as React from 'react';
import { getSP } from '../loc/pnpjsConfig';
import { SPFI } from '@pnp/sp';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss"
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import UserContext from '../../../GlobalContext/context';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss"
import Provider from '../../../GlobalContext/provider';
import { useMediaQuery } from 'react-responsive';
import styles from './Form.module.scss'
import Swal from 'sweetalert2';
import Select from "react-select";

// import context from '../../../GlobalContext/context';
// import classNames from "classnames";
// import { useState, useEffect, useRef , useMemo } from "react";
// import JoditEditor from "jodit-react";
// import Jodit from 'jodit-react';
let selectedUsersForPermission:any[];
// let description:any;


export const ManageSuper = (props:any) => {
    const sp: SPFI = getSP();
    const { useHide }: any = React.useContext(UserContext);
    const elementRef = React.useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const [selectedUser,setSelectedUser]=React.useState([]);
    const [refresh,setRefresh]=React.useState(false);
    const [activeComponent,setActiveComponent]=React.useState('');
    const [user,setUser]=React.useState<any[]>([]);
    // const [description,setDescription]=React.useState('');
    console.log("selectedUser",selectedUser);
    console.log("props",props);

    React.useEffect(()=>{
            const fetchUserFromSelectedGroup=async()=>{
                try {
                    // const subsiteContext = await sp.site.openWebById(props.selectedEntityForPermission.SiteID);
                    // const usersFromSelectedGroups = await subsiteContext.web.siteGroups.getByName(`${props.selectedGropuForPermission.value}`).users();
                    // console.log("usersFromSelectedGroups",usersFromSelectedGroups);
                    const usersFromDMSSuperAdmin = await sp.web.siteGroups.getByName('DMSSuper_Admin').users();
                    setSelectedUser(usersFromDMSSuperAdmin);
                  } catch (error) {
                    console.log("error from getting the users from the groups after selecting the groups",error);
                  }
            }
            fetchUserFromSelectedGroup();
    },[refresh]);

    const handleDeleteUser=async(userId:any,UserTitle:any)=>{
        console.log("UserId",userId);
        try {

            // const subsitecontext=await sp.site.openWebById(props.selectedEntityForPermission.SiteID);
            // Get the group by name
            const group = await sp.web.siteGroups.getByName('DMSSuper_Admin');
            // Remove the user from the group using their userId
            await group.users.removeById(userId);
            console.log(`User with ID ${userId} has been removed from the super admin group`);
            onRemove(UserTitle);
            setRefresh(!refresh);
        } catch (error) {
            console.error("Error removing user from group: ", error);
        }
    }

    const handleToggleAddUsers=()=>{
        setActiveComponent("AddUser");
    }
    
    const handleUsersSelect=(selectedUsers:any)=>{
        console.log("selectedUsers",selectedUsers);
        selectedUsersForPermission=selectedUsers;
    }

    React.useEffect(()=>{
        const fetchUsers=async()=>{
            const user = await sp.web.siteUsers();
            console.log("users fetch from the site",user);
              const usersArray=user.map((user)=>(
                    {
                      id:String(user.Id),
                      value: user.Title,
                      email: user.Email,
                      label:user.Title,
                      loginName:user.LoginName
                    }
              ))
              console.log("site users",usersArray);
              setUser(usersArray);
        }
        fetchUsers();
        
       
    },[])

    // console.log("description",description);
    // React.useEffect(()=>{
    //      // Add Description
    //      const addDescription=()=>{
    //         const result: string = props.selectedGropuForPermission.value.split("_")[1];
    //         console.log("Description",result);
    //         switch (result) {
    //             case 'Admin':
    //                  setDescription("Full Control - Has full control.");
    //                  break;
    //             case 'Read':
    //                 setDescription("Read - Can view pages and download documents.");
    //                 break;
    //             case 'View':
    //                 setDescription("View - Can only view content.");
    //                 break;
    //             case 'Contribute':
    //                 setDescription("Contribute - Can view, add, update, and delete documents.");
    //                 break;
    //             case 'Initiator':
    //                 setDescription("Initiator - Can view, add, update and delete documents.");
    //                 break;
    //             case 'Approval':
    //                 setDescription("Approval - Can view, add, update and delete documents.");
    //                 break;
    //             case 'AllUsers':
    //                 setDescription("AllUsers - Can view, add, update and delete documents.");
    //                 break;
    //             default:
    //                 setDescription("Unknown role.");
    //         }
    //     }
    //     addDescription();

    // },[])
   

    const handleAddUsers=async()=>{
        console.log("selectedUsersForPermission",selectedUsersForPermission);
        // console.log("selectedGropuForPermission",props.selectedGropuForPermission.value);
        // console.log("selectedEntityForPermission",props.selectedEntityForPermission.value);

        if(selectedUsersForPermission === undefined || selectedUsersForPermission.length === 0){
          checkValidation();
          return;
        }
        // const subsiteContext = await sp.site.openWebById(props.selectedEntityForPermission.SiteID); 
        selectedUsersForPermission.forEach(async(user:any)=>{
          try {
            const userObj = await sp.web.ensureUser(user.email);
            console.log("userObj",userObj);
            const users=await sp.web.siteGroups.getByName('DMSSuper_Admin').users.add(userObj.data.LoginName);
            console.log(`${user.email} added to the super admin group successfully.`,users);
          } catch (error) {
            console.error(`Failed to add ${user.email} to the group: `, error);
          }
        })
        onSuccess();
        setRefresh(!refresh);
        setActiveComponent('');
        
      }
    
    const handleBackToTable=()=>{
        setActiveComponent('');
    }
    const onSuccess=()=>{
        Swal.fire(`Users Added Successsfully`,"", "success");
    }
    const onRemove=(UserTitle:any)=>{
        Swal.fire(`${UserTitle} Removed Successsfully`,"", "success");
    }
    const checkValidation=()=>{
        Swal.fire("Please fill out the fields!", "All fields are required");
  }

  return (
<>
              {activeComponent === '' && (
                    <div className={styles.argform}>
                        <div className='row'>
                            <div className='col-md-7'>
                            <div className='page-title fw-bold mb-0 font-20'>Admin Panel &gt; Manage Super Admin
                            </div>
                            <div className='mb-2 mt-0'>
                            <span className='text-muted font-14' style={{
                                color:"Black"
                            }}>User From Super Admin Group Will Have Full Control 1.</span>
                        </div>
                            </div>
                            <div className='col-md-5'>
                            <div className='justify-content-end'>
                                <div className='padd-right1 mt-0'>
                                    
                            <button  style={{height:'40px', borderRadius:'4px', padding:'9px 10px'
                        
                            }}type="button" className='btn btn-primary' onClick={handleToggleAddUsers}>
                                Add User
                            </button>
                            </div></div></div>
                        </div>
                        <div>
                      
                      
                            {/* <a className={styles.backbuttonform}
                                onClick={props.onBack}
                            >
                                <img
                                className={styles.backimg}
                                />
                                <p className={styles.Addtext}>Back</p>
                            </a> */}
                           
                        
                        </div>
                       
                        <div style={{padding:'15px'}} className={styles.container}>
                        <table className="mtbalenew">
                            <thead>
                            <tr>
                                <th style={{minWidth:'20px',maxWidth:'20px'}}>S.No.</th>
                                <th style={{minWidth:'80px',maxWidth:'80px'}}>User</th>
                                <th>Email</th>
                                <th style={{minWidth:'40px',maxWidth:'40px'}}>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedUser.map((item:any, index:any) => (
                                <React.Fragment key={item.Id}>
                                <tr>
                                    <td style={{minWidth:'20px',maxWidth:'20px'}}>
                                    <span className='indexdesign'> {index + 1}</span>
                                    </td>
                                    <td style={{minWidth:'80px',maxWidth:'80px'}}>
                                    {item.Title || ''}
                                    </td>
                                    <td >
                                    {item.Email || ''}
                                    </td>
                                    <td style={{minWidth:'40px',maxWidth:'40px'}}>
                                    <img
                                        className={styles.deleteicon}
                                        src={require("../assets/del.png")}
                                        alt="Delete"
                                        onClick={(event)=>{
                                            handleDeleteUser(item.Id,item.Title)
                                        }}
                                    />
                                    </td>
                                </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                        </table>
                        </div>
                    </div>
              )}
              {activeComponent === "AddUser" && 
                (
                <div className={styles.argform}>
                    <div className='row'>
                        <div className='col-md-7'>

                      
                
                    <div className={styles.title}>Admin Panel &gt; Manage Super Admin &gt; Add Super Admin</div>
                    </div>
                    <div className='col-md-5'>
                    <div className='padd-right1 mt-0'>
                        <button style={{display:"inline-block",minWidth:"auto"}} type='button' onClick={handleBackToTable} className={styles.backbuttonform}>
                            Back
                        </button>
                    </div>
                    </div>
                    </div>
                    <div style={{
                      
                      position:"relative",
                      
                      marginTop:"10px",
                      padding:"20px",
                      border:"2px solid #54ade0",
                      borderRadius:"10px",
                      background:"#fff",

                    }}>
                        <p style={{
                            color:"Black",
                           
                        }}>Add Users</p>
                        <div style={{
                            gap:"30px",
                            display:"flex"
                        }}>
                            <div  style={{
                                width:"370px"
                            }}>
                                <Select
                                    isMulti
                                    options={user}
                                    onChange={(selected: any) =>
                                    handleUsersSelect(selected)
                                    }
                                    placeholder="Select User..."
                                    noOptionsMessage={() => "No User Found..."}
                                />
                            </div>

                            <div>
                                <button type='button' style={{padding:'9px 10px', borderRadius:'4px'}} className='btn btn-primary' onClick={handleAddUsers}>
                                    Add
                                </button>
                            </div>
                        </div>
                        
                    </div>           
                </div>
                )
              } 
              </> 
           
  )
}
