"use client"
import React, { useState, useEffect } from 'react';

class NewsPublisher {
    private observers: NewsObserver[] = [];
    private latestNews: string = '';
  
    addObserver(observer: NewsObserver) {
      this.observers.push(observer);
    }
  
    removeObserver(observer: NewsObserver) {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    }
  
    setNews(news: string) {
      this.latestNews = news;
      this.notifyObservers();
    }
  
    private notifyObservers() {
      for (const observer of this.observers) {
        observer.update(this.latestNews);
      }
    }
  }
  
  // Observer interface
  interface NewsObserver {
    update(news: string): void;
  }
  

const page = () => {
    const [news, setNews] = useState<string>('');
    const publisher = new NewsPublisher();
  
    useEffect(() => {
      const observer: NewsObserver = {
        update: (latestNews: string) => {
          setNews(latestNews);
        }
      };
  
      publisher.addObserver(observer);
  
      // Cleanup
      return () => {
        publisher.removeObserver(observer);
      };
    }, []);
  
    const publishNews = () => {
      const newNews = `Breaking News: ${Math.random().toString(36).substring(7)}`;
      publisher.setNews(newNews);
    };
  
    return (
      <div>
        <h1>Latest News</h1>
        <p>{news || 'No news yet'}</p>
        <button onClick={publishNews}>Publish New News</button>
      </div>
    );
}

export default page