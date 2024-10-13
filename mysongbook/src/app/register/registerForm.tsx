'use client'

import { FieldErrors, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { ErrorMessage } from "@hookform/error-message";

export type HookFormTypes = {
    [key: string]: string;
    ID : string;
    email: string;
    password: string;
    passwordCheck : string;
    nickName : string;
    
  }


  
  export default function HookForm(){
    const { register, handleSubmit, getValues, control, formState: { errors} } = useForm<HookFormTypes>();

    function validate (property: string){
      let errorMessage = errors[property];
      return(
      <div className="h-10 ">
          {errorMessage ? (
          <>
              {errorMessage.type === "required" && (
                <p className=" text-red-500 ">
                  {errorMessage.message}
                </p>
              )}
              {errorMessage.type === "pattern" && (
                <p className=" text-red-500 ">
                  {errorMessage.message}
                </p>
              )}
              {errorMessage.type === "check" && (
                <p className=" text-red-500 ">
                  {errorMessage.message}
                </p>
              )}
          </>
          ) : <p/>}  
        </div>)
    }

    const onSubmit = (data: HookFormTypes) => {
        console.log("Form submitted.", data)
    };

    return (
      <div className="container mx-auto px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">

          <label htmlFor="ID"> 아이디 </label>
          <p>
            <input
              id="ID"
              {...register("ID", {
                required:{
                  value: true,
                  message: "* 필수 입력 항목입니다."}})}
              type="text"
              placeholder="ID"
              className="rounded-md border-2 border-black min-w-[300px] sm:w-4/5 md:w-4/5 lg:w-1/2 h-10" />
          </p>
          {validate('ID')}


          <label htmlFor="email"> 이메일 </label>
          <p>
            <input
              id="email"
              {...register("email", {
                required:{
                  value: true,
                  message: "* 필수 입력 항목입니다."},
                pattern:{
                  value:/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, 
                  message: "* 이메일 형식이 아닙니다."}})}
              type="text"
              placeholder="email" />
          </p>
          {validate('email')}
        

          <label htmlFor="password"> 비밀번호 </label>
          <p>
            <input
              id="password"
              {...register("password", {
                required:{
                  value: true,
                  message: "* 필수 입력 항목입니다."},
                pattern:{
                  value:/^[a-zA-Z0-9~@$!%*?&]{1,20}$/,
                  message: "* 비밀번호 형식이 아닙니다. 20자 이하의 영어 대소문자, 숫자, 특수기호만( ~, @ , $ , ! , % , * , ? , & )이 사용 가능합니다."}})}
              type="password"
              placeholder="PW" />
          </p>
          {validate('password')}

          <label htmlFor="password"> 비밀번호 확인 </label>
          <p>
            <input
              id="passwordCheck"
              {...register("passwordCheck", {
                required:{
                  value: true,
                  message: "* 필수 입력 항목입니다."},
                validate: {
                  check: (val) => {
                    if (getValues("password") !== val) {
                    return "* 비밀번호가 일치하지 않습니다.";
                  }
                }}})}
              type="passwordCheck"
              placeholder="PW CHECK" />
          </p>
          {validate('passwordCheck')}

          <label htmlFor="password"> 닉네임 </label>
          <p>
            <input
              id="nickName"
              {...register("nickName", {
                required:{
                  value: true,
                  message: "* 필수 입력 항목입니다."},
                pattern:{
                  value:/^[가-힣a-zA-Z0-9][가-힣a-zA-Z0-9 ]{0,18}[가-힣a-zA-Z0-9]$/,
                  message: "* 2자이상 20자 이하의 영어 대소문자, 한국어, 숫자만이 사용 가능합니다."}})}
              type="nickName"
              placeholder="NICKNAME" />
          </p>
          {validate('nickName')}

        
          
          
          <input type="submit" />

    

        </form>
        <DevTool control={control} />
      </div>
    );

    

    
  };

  