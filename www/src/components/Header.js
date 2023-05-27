import React, { useContext } from "react";
import AuthContext from '../context/AuthContext';
import home from '../graphics/home.ong.png';
import bin from '../graphics/bin.png';
import logo from '../graphics/logout.png';

const Header = () => {
    const {logout} = useContext(AuthContext);
    return(
        	<div className="col-1">
                <a href="#">
                    <div className="nav-item active-pg">
                        <img src={home} className="ic_left ic_compose"/>
                        <h6 className="ic_text">NOTES</h6>
                    </div>
                </a>
                <a href="#">
                    <div className="nav-item">
                        <img src={bin} className="ic_left ic_compose"/>
                        <h6 className="ic_text">BIN</h6>
                    </div>
                </a>
                    <div className="nav-item extra"></div>
                    <div className="nav-item extra"></div>
                    <div className="nav-item extra"></div>
                    <div className="nav-item extra"></div>
                <a onClick={() => logout()}>
                    <div className="nav-item">
                        <img style={{"WebkitFilter": "invert(100%)", "filter": "invert(100%)"}} src={logo} className="ic_left ic_compose"/>
                        <h6 className="ic_text">LOGOUT</h6>
                    </div>
                </a>
	    </div>
    )
};

export default Header;