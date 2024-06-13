"use server"

import { prisma } from "@/lib/db/prisma";

type noteProps ={
    id?:string;
    title:string;
    text:string
    noteDate:string
}

export const addNote = async ({title , text, noteDate}:noteProps) =>{
    if(!title){
        return {error: "title is reuqired!"}
    }
    await prisma.note.create({
        data:{
            title,
            text,
            noteDate
        }
    })
    return {success:"note has been created!"}
}

export const udpateNote = async ({id , title , text , noteDate}:noteProps) =>{
    if(!id){
        return {error:"seem like something went wrong with you account"}
    }
    if(!title){
        return {error: "title is reuqired!"}
    }
    await prisma.note.update({
        where:{
            id
        },
        data:{
            title ,
            text ,
            noteDate
        }
    })
    return {success:"note has been updated!"}
}

export const deleteNote = async (id:string) =>{
    if(!id){
        return {error:"seem like something went wrong with you account"}
    }
    await prisma.note.delete({
        where:{
            id
        }
    })
    return {success:"note has been deleted!"}
}