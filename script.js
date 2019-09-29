"use strict";

document.addEventListener("DOMContentLoaded", get);
const editForm = document.querySelector("#editform");
const form = document.querySelector("#addform");
// form.setAttribute("novalidate", true);

function get() {
  fetch("https://todolist-d02e.restdb.io/rest/todo", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d90d0b41ce70f637985513c",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(list => {
      list.forEach(addTodoToTheDom);
    });
}

function addTodoToTheDom(todo) {
  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);

  console.log(todo);

  copy.querySelector("article.todo").dataset.todoid = todo._id;
  copy.querySelector("h1").textContent = todo.title;
  copy.querySelector("h2").textContent = todo.category;
  copy.querySelector(".p1").textContent = todo.time.slice(11).slice(0, 5);
  copy.querySelector(".p2").textContent = todo.date.slice(0, 11 - 1);
  copy.querySelector(".removeTodo").value = todo._id;
  copy.querySelector(".removeTodo").addEventListener("click", () => {
    removeTodo(todo._id);
  });
  copy.querySelector(".edit").addEventListener("click", () => {
    document.querySelector(".info_box").classList.remove("fade_in_out");

    document.querySelector("#editform").style.display = "flex";
    document.querySelector("#addform").style.display = "none";
    document.querySelector(".title").textContent = "EDIT A List";
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetchAndPopulate(todo._id);
  });

  document.querySelector(".app").prepend(copy);
  document.querySelector(".app").style.opacity = "1";
}

function post(title, category, time, date) {
  const data = {
    title: title,
    category: category,
    time: time,
    date: date
  };

  const postData = JSON.stringify(data);
  fetch("https://todolist-d02e.restdb.io/rest/todo", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d90d0b41ce70f637985513c",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(data => {
      //   window.location = "";
      addTodoToTheDom(data);
    });
}

function removeTodo(id) {
  fetch(`https://todolist-d02e.restdb.io/rest/todo/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d90d0b41ce70f637985513c",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {
      // TODO: Delete from DOM.
      console.log(id);
      document.querySelector(`.todo[data-todoid="${id}"]`).remove();
    });
}

form.addEventListener("submit", grab);

editForm.addEventListener("submit", evt => {
  document.querySelector("#editform").style.display = "none";
  document.querySelector("#addform").style.display = "flex";
  document.querySelector(".title").textContent = "ADD A TODO";

  evt.preventDefault();
  put();
});

function grab() {
  event.preventDefault();

  let title = form.elements.title.value;
  let category = document.querySelector('input[name="option"]:checked').value;
  let time = form.elements.time.value;
  let date = form.elements.date.value;

  post(title, category, time, date);
}

function resetTodoInfo() {
  form.elements.title.value = "";
  form.elements.category.value = "";
  form.elements.time.value = "";
  form.elements.date.value = "";
  editForm.elements.title.value = "";
  editForm.elements.category.value = "";
  editForm.elements.time.value = "";
  editForm.elements.date.value = "";
}

function fetchAndPopulate(id) {
  fetch(`https://todolist-d02e.restdb.io/rest/todo/${id}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d90d0b41ce70f637985513c",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(list => {
      editForm.elements.title.value = list.title;
      document.querySelector('input[name="edittedoption"]:checked').value = list.category;
      editForm.elements.time.value = list.time;
      editForm.elements.date.value = list.date;
      editForm.elements.id.value = list._id;
    });
}

function put() {
  let data = {
    title: editForm.elements.title.value,
    category: document.querySelector('input[name="edittedoption"]:checked').value,
    time: editForm.elements.time.value,
    date: editForm.elements.date.value
  };

  let postData = JSON.stringify(data);
  const superID = editForm.elements.id.value;

  // TODO: SCROLL TO SELECTED TARGET BASED ON ID.

  document.querySelector(".info_box").classList.add("fade_in_out");

  fetch(`https://todolist-d02e.restdb.io/rest/todo/${superID}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d90d0b41ce70f637985513c",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(d => d.json())
    .then(updatedTodo => {
      //  Find parent
      const parentElement = document.querySelector(`.todo[data-todoid="${updatedTodo._id}"]`);

      parentElement.querySelector("h1").textContent = updatedTodo.title;
      parentElement.querySelector("h2").textContent = updatedTodo.category;
      parentElement.querySelector(".p1").textContent = updatedTodo.time.slice(11).slice(0, 5);
      parentElement.querySelector(".p2").textContent = updatedTodo.date.slice(0, 11 - 1);
    });
}

console.log(document.querySelector('input[name="option"]:checked').value);
