import React from "react";
import MessageComponent from "./MessageComponent";
export interface ResponseProps {
  message: string;
  role: string;
}

export default function Response({ message, role }: ResponseProps) {
  return (
    <div
      className={`flex flex-row items-start p-4 ${
        role === "user" ? "bg-slate-600" : "bg-slate-700"
      }`}
    >
      <span className="pr-4 w-10 mr-16">
        {role === "user" ? (
          <svg
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            viewBox="0 -960 960 960"
            width="48"
          >
            <path d="M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-160v-94q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5t127.921 44.694q31.301 14.126 50.19 40.966Q800-292 800-254v94H160Zm60-60h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm260-321q39 0 64.5-25.5T570-631q0-39-25.5-64.5T480-721q-39 0-64.5 25.5T390-631q0 39 25.5 64.5T480-541Zm0-90Zm0 411Z" />
          </svg>
        ) : (
          <svg
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            viewBox="0 -960 960 960"
            width="48"
          >
            <path d="M120-80v-270h120v-160h210v-100H330v-270h300v270H510v100h210v160h120v270H540v-270h120v-100H300v100h120v270H120Zm270-590h180v-150H390v150ZM180-140h180v-150H180v150Zm420 0h180v-150H600v150ZM480-670ZM360-290Zm240 0Z" />
          </svg>
        )}{" "}
      </span>

      <div className="container mx-auto">
        <pre className="whitespace-pre-wrap break-words">
          <MessageComponent message={message} />
        </pre>
      </div>
    </div>
  );
}
