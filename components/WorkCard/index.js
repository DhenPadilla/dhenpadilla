import React from "react";
import Image from "next/image";

const WorkCard = ({ img, name, description, onClick }) => {
  return (
    <div
      className="overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link hover:cursor-pointer"
      onClick={onClick}
    >
      <div
        className="relative rounded-md border-2 overflow-hidden transition-all ease-out duration-300 h-48 mob:h-auto"
        style={{ height: "200px" }}
      >
        <Image
          alt={name}
          layout="fill"
          className="h-full w-full object-cover hover:scale-110 transition-all ease-out duration-300"
          src={img}
        />
      </div>
      <h1 className="mt-5 text-md font-medium">
        {name ? name : "Project Name"}
      </h1>
      <h2 className="text-sm opacity-80">
        {description ? description : "Description"}
      </h2>
    </div>
  );
};

export default WorkCard;
