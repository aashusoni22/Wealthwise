import React from "react";
import { SiCardano } from "react-icons/si";

const Logo = ({ textsize }) => {
  return (
    <h1
      className={`${textsize} flex gap-1 items-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600`}
    >
      <SiCardano className={`text-pink-500 ${textsize}`} />
      Finansly
    </h1>
  );
};

export default Logo;
