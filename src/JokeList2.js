import React, { useEffect, useRef, useState } from 'react'
import axios from "axios";
import "./JokeList.css";
import Joke from './Joke';

const JokeList2 = () => {
    const numJokesToGet = 5;
    const [jokes, setJokes] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    const isLoading = useRef(true);

    useEffect(() => {
        const getJokes = async () => {
            const newJokes = [];
            const seenJokes = new Set();

            try{
                while(newJokes.length < numJokesToGet){
                    let res = await axios.get("https://icanhazdadjoke.com", {
                        headers: { Accept: "application/json" }
                    });
                    let { ...joke } = res.data;

                    if(!seenJokes.has(joke.id)){
                        seenJokes.add(joke.id);
                        newJokes.push({...joke, votes: 0});
                    } else {
                        console.log("duplicate found!");
                    }
                }
                // setIsLoading(false);
                setJokes([...newJokes]);
                isLoading.current = false;

            }catch (err) {
                console.error(err);
            }
        }
        getJokes();
        console.log("rendering");

    }, [isLoading.current])

    const generateNewJokes = () => {
        console.log("clicked!");
        debugger;
        isLoading.current = true;
        setJokes([]);
    }
    
    const vote = (id, delta) => {
        let newJokes = jokes.map(j => 
            j.id === id ? {...j, votes: j.votes + delta} : j
        );
        setJokes(newJokes);
    }
    
  return (
    <div className='JokeList'>
        <h1>Refactoring Jokelist</h1>
        <button className='JokeList-getmore' onClick={generateNewJokes}>Get New Jokes</button>
        { isLoading.current ?
          <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
          </div>
          :
          jokes.sort((a,b) => b.votes - a.votes).map(j => (
            <Joke
                text={j.joke}
                key={j.id}
                id={j.id}
                votes={j.votes}
                vote={vote}
            />
          ))
        }

    </div>
  )
}

export default JokeList2