'use client'

import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { ErrorMessage } from "@hookform/error-message";

export type HookFormTypes = {
    ID : string;
    email: string;
    password: string;
    passwordCheck : string;
    nickName : string;
    
  }
  
  export default function HookForm(){
    const { register, handleSubmit, watch, control, formState: { errors} } = useForm<HookFormTypes>();

    const onSubmit = (data: HookFormTypes) => {
        console.log("Form submitted.", data)
    };
    return (
      <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>
          <input
            {...register("email", {
              required:{
                value: true,
                message: "* 필수 입력 항목입니다."},
              pattern:{
                value:/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, 
                message: "* 이메일 형식이 아닙니다."}})}
            type="text"
            placeholder="ID" />
        </p>
        
        <div className="h-10 ">
          {errors.email ? (
          <>
              {errors.email.type === "required" && (
                <p className=" text-red-500 ">
                  {errors.email.message}
                </p>
              )}
              {errors.email.type === "pattern" && (
                <p className=" text-red-500 ">
                  {errors.email.message}
                </p>
              )}
            </>
          ) : <p/>}  
        </div>

        <p>
          <input
            {...register("password", {
              required:{
                value: true,
                message: "* 필수 입력 항목입니다."},
              pattern:{
                value:/^(?=.*[a-zA-Z0-9@$!%*?&])$/, 
                message: "* 비밀번호 형식이 아닙니다. 영어 대소문자, 숫자, 특수기호만이 사용 가능합니다."}})}
            type="password"
            placeholder="PW" />
        </p>
        
        <div className="h-10 ">
          {errors.password ? (
          <>
              {errors.password.type === "required" && (
                <p className=" text-red-500 ">
                  {errors.password.message}
                </p>
              )}
              {errors.password.type === "pattern" && (
                <p className=" text-red-500 ">
                  {errors.password.message}
                </p>
              )}
            </>
          ) : <p/>}  
        </div>

      
        
        
        <input type="submit" />

  

      </form>
      <DevTool control={control} />
      </div>
    );

    

    
  };

  