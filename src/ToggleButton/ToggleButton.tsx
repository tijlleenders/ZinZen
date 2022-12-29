import React, { useEffect} from 'react';
import { atom, useRecoilState } from 'recoil';
import ClockToggle from "@assets/images/ClockToggle.svg";
import TargetToggle from  '@assets/images/TargetToggle.svg';
import { Router, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "./ToggleButton.scss";

const isToggledOnAtom = atom({
    key: 'isToggledOn',
    default: false,
  });

export const ToggleButton: React.FC = () => {

  const [isToggledOn, setIsToggledOn] = useRecoilState(isToggledOnAtom);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/MyGoals') {
      setIsToggledOn(false);
    } else {
      setIsToggledOn(true);
    }
  }, [location]);

  const handleToggle = () => {
    setIsToggledOn(!isToggledOn);
    if(isToggledOn){
        navigate("/MyGoals");
    }
    else{
        navigate("/")
    }
  };

  return (
    <div className="toggle-button" onClick={handleToggle}>
      <div className={`image-1 ${isToggledOn ? 'toggled-on' : ''}`}>
        <img src={ClockToggle} alt="Image 1" />
      </div>
      <div className={`image-2 ${!isToggledOn ? 'toggled-on' : ''}`}>
        <img src={TargetToggle} alt="Image 2" />
      </div>
    </div>
  );
};