"use client"
import React, { useEffect, useState } from 'react'

type newObserver = {
    update:(news:string)=>void;
}

class NewsPublisher {
    private observer:newObserver[] = []
    private latestNews = '';

    addObserver(observer:newObserver){
        this.observer.push(observer)
    }

    removeObserver(observer:newObserver){
        const index = this.observer.indexOf(observer)
        if(index > - 1){
            this.observer.splice(index , 1)
        }
    }

    setNews(news:string){
        this.latestNews = news
        this.notifyObserver()
    }

    private notifyObserver(){
        for(const observer of this.observer){
            observer.update(this.latestNews)
        }
    }
}

const page = () => {
  const [news , setNews] = useState<string>('')
  const publisher = new NewsPublisher();

  useEffect(()=>{
    const observer:newObserver ={
        update:(latestNews:string)=>{
            setNews(latestNews)
        }
    }
    publisher.addObserver(observer)
    return ()=>{
        publisher.removeObserver(observer)
    }
  },[])

  const publishNews = () =>{
    const newNews = `Breaking News: ${Math.random().toString(36).substring(7)}`
    publisher.setNews(newNews)
  }

  return (
    <div>
        <h1>Latest News</h1>
        <p>{news || "No news yet"}</p>
        <button onClick={publishNews}></button>
    </div>
  )
}

export default page