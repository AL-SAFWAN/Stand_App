import React, {useState} from 'react'
import {TextField} from '@material-ui/core'


export default function TodoForm({ id,todos,setTodos,classes }) {
    const addTodo = text => {
      const newTodos = [...todos, { text, isCompleted: false }];
      setTodos(newTodos);
    };

    const [value, setValue] = useState("");

    const handelSubmit = e => {
      e.preventDefault();
      if (!value) return;
      addTodo(value);

      setValue("");
    };

    return (
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={handelSubmit}
      >
        <TextField
          id={id}
          label={id}
          variant="outlined"
          style={{ width: 245 }}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      
      
      </form>
    );
  }
