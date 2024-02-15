import { Link } from "react-router-dom";

const handleMouseEnter = (e) => {
  e.currentTarget.style.textDecoration = "underline";
};

const handleMouseLeave = (e) => {
  e.currentTarget.style.textDecoration = "none";
};

const linkStyle = {
  textDecoration: "none",
  transition: "text-decoration 0.3s",
  color: "black",
};

export const getProfileImage = (item) => {
  return (
    <div>
      <Link
        to={
          window.localStorage.getItem("user_nickname") === item.nickName
            ? `/portfolio`
            : `/portfolio/${item.nickName}`
        }
        className="hoverable-item"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={linkStyle}
      >
        <img
          style={{
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            border: "3px solid salmon",
            marginRight: "10px",
          }}
          src={`https://storage.googleapis.com/hongik-pickme-bucket/${item.imageUrl}`}
        />
      </Link>
    </div>
  );
};

export const renderProfileImage = (item) => {
  return (
    <div
      style={{
        display: "flex",
        marginBottom: "10px",
        alignItems: "center",
      }}
    >
      {getProfileImage(item)}
      <div>
        <Link
          to={
            window.localStorage.getItem("user_nickname") === item.nickName
              ? `/portfolio`
              : `/portfolio/${item.nickName}`
          }
          className="hoverable-item"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={linkStyle}
        >
          <strong className="nickname">{item.nickName}</strong>
        </Link>
      </div>
    </div>
  );
};
