"use client";
import Avatar from "@mui/material/Avatar";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import app from "./_firebase/Config";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import "./menu.css";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/features/authSlice";

const menuList = [
  {
    title: "待審核問題",
    icon: <PendingActionsOutlinedIcon />,
    url: "/pending",
  },
  { title: "問答集", icon: <LiveHelpOutlinedIcon />, url: "/checked" },
  { title: "近期刪除", icon: <DeleteOutlineOutlinedIcon />, url: "/recentDel" },
  {
    title: "尚未確認問題",
    icon: <ContentPasteSearchOutlinedIcon />,
    url: "/noAssign",
  },
  {
    title: "意見反映",
    icon: <ContentPasteSearchOutlinedIcon />,
    url: "/testmail",
  },
];

const MiniDrawer = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (pathname == "/") {
  //     router.push("pending");
  //   }
  // }, [pathname]);
  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        dispatch(logoutUser(currentUser));
      }
    });

    return () => {
      unsub();
    };
  }, []);
  return (
    <div className="sidebar">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          paddingTop: "3rem",
        }}
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={220}
          height={65}
          priority={true}
        />
        {/* Sidebar Header */}
      </div>
      <div className="sidebar-item">
        {/* Sidebar Menu */}
        {menuList.map((item, index) => (
          <div
            className={`sidebar-button ${
              pathname === item.url ? "active" : ""
            }`}
            key={index}
            onClick={() => router.push(item.url)}
          >
            <p className="sidebar-icon">{item.icon}</p>
            <p className="sidebar-text">{item.title}</p>
          </div>
        ))}
      </div>
      {user ? (
        <div
          className="user"
          onClick={() => router.push("/")}
          // style={{
          //   display: "flex",
          //   flexDirection: "column",
          //   alignItems: "center",
          //   cursor: "pointer",
          // }}
        >
          <Avatar
            alt={user?.displayName || undefined}
            src={user?.photoURL || undefined}
          />
          <span style={{ color: "black", marginLeft: "1.5rem" }}>
            {user.displayName}
          </span>
        </div>
      ) : (
        <div
          onClick={() => router.push("/")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Avatar />
          <span style={{ color: "white" }}>Guest</span>
        </div>
      )}
    </div>
  );
};

export default MiniDrawer;
