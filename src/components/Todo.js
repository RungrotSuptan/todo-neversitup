import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Axios from 'axios';

const customStyles = {
    content : {
      top : '50%',
      left : '50%',
      right : 'auto',
      bottom : 'auto',
      marginRight : '-50%',
      transform : 'translate(-50%, -50%)'
    }
};

const TODO_ENDPOINT = "https://candidate.neversitup.com/todo"

const Todo = ({session}) => {
    var subtitle;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [modalIsOpen, setIsOpen] = useState(false);
    const [todos, setTodos] = useState({
        items: []
    });

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // subtitle.style.color = '#f00';
    }
     
    function closeModal(){
        setIsOpen(false);
    }

    const handleTitle = event => {
        setTitle(event.target.value)
    }
    const handleDescription = event => {
        setDescription(event.target.value)
    }

    async function createTodo (){
        const access_token = localStorage.getItem('access_token')
        let response = await Axios.post(`${TODO_ENDPOINT}/todos`,{
            "title": title,
	        "description": description
        },{
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        console.log("create: ",response)
        fetchTodo()
        closeModal()
    }

    async function fetchTodo(){
        const access_token = localStorage.getItem('access_token')
        let response = await Axios.get(`${TODO_ENDPOINT}/todos`,{
            headers: {
                'Authorization': `${access_token}`
            }
        })
        setTodos({
            items: response.data
        })
    }

    useEffect(() => {
        fetchTodo()
      return () => {
        // fetchTodo()
      }
    }, [])

    function deteteTodo (id){
        const access_token = localStorage.getItem('access_token')
        Axios.delete(`${TODO_ENDPOINT}/todos/${id}`,{
            headers: {
                'Authorization': `${access_token}`
            }
        }).then(res => {
            fetchTodo()
        })
    }

    return (
        <div>
            
            <div>
                {
                    todos.items.length > 0 ? todos.items.map((todo, key) => {
                        return (
                        <div key={todo._id}>
                            <h3 key={key}>{todo.title}</h3>
                            <p>{todo.description}</p>
                            <p>created: {todo.createdAt}</p>
                            <p>updated: {todo.updatedAt}</p>
                            <button type="text" onClick={() => {
                                deteteTodo(todo._id)
                            }}>delete</button>
                        </div>
                        )
                    }) : <p> Empty press 'Create' for add new todo </p>
                }
            </div>

            <button onClick={openModal}>Open Modal</button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Create a new todo"
            >
                <div>
                    <div>Title</div>
                    <input type="text" placeholder="Title" onChange={handleTitle}/>
                    <div>Desscription</div>
                    <input type="text" placeholder="Desscription" onChange={handleDescription}/>
                </div>
                <div>
                    <button type="button" onClick={closeModal}>Cancle</button>
                    <button type="button" onClick={createTodo}>Create</button>
                </div>
            </Modal>
        </div>
    )
}

export default Todo