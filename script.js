let allCosts = [];
const link = "http://localhost:7000";
const fetchHeaders = {
  "Content-Type": "application/json;charset=utf-8",
  "Access-Control-Allow-Origin": "*",
};
let activeEditTask = null;

window.onload = async () => {
  try {
    const response = await fetch(`${link}/costs`);
    const result = await response.json();
    allCosts = result.allCosts;
    render();
  } catch (error) {
    console.log("The request failed");
  }
};

const addCost = async () => {
  try {
    let whereInput = document.getElementById("content__first_input");
    let howMuchInput = document.getElementById("content__second_input");
    if (whereInput.value && howMuchInput.value !== "") {
      const result = await fetch(`${link}/costs`, {
        method: "POST",
        headers: fetchHeaders,
        body: JSON.stringify({
          text: whereInput.value,
          cost: howMuchInput.value,
          date: new Date().toLocaleDateString,
        }),
      });
      const data = await result.json();
      allCosts.push(data);
      whereInput.value = "";
      howMuchInput.value = "";
      render();
    } else {
      return false;
    }
  } catch (error) {
    console.log("The request failed");
  }
};

const deleteTask = async (_id) => {
  try {
    const response = await fetch(`${link}/costs/${_id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (result.deletedCount > 0) {
      allCosts = allCosts.filter((item) => item._id !== _id);
    }
    render();
  } catch (error) {
    console.log("failed to delete");
  }
};

const updateEditCost = async (_id) => {
  try {
    const text = document.getElementById(`text__input-${_id}`);
    const cost = document.getElementById(`cost__input-${_id}`);
    const date = document.getElementById(`date__input-${_id}`);
    console.log(text);
    const resp = await fetch(`${link}/costs/${_id}/text`, {
      method: "PATCH",
      headers: fetchHeaders,
      body: JSON.stringify({
        text: text.value,
        cost: cost.value,
        date: date.value,
      }),
    });
    const result = await resp.json();
    allCosts.forEach((item) => {
      if (item._id === result._id) {
        item.text = result.text;
        item.cost = result.cost;
        item.date = result.date;
      }
    });
    render();
  } catch (error) {
    console.error("Failed to change");
  }
};

const doneEditTask = () => {
  activeEditTask = null;
  render();
};

const cancelEdit = (item) => {
  activeEditTask = item._id;
  activeEditTask = null;
  render();
};

const editTask = (item) => {
  const { _id, text, cost, date } = item;
  let expense = document.getElementById(`task-${_id}`);

  const cancelImage = document.createElement("img");
  const cancelImageButton = document.createElement("div");
  const doneImageButton = document.createElement("div");
  const doneImage = document.createElement("img");
  const newExpense = document.createElement("div");
  const newCost = document.createElement("input");
  const newText = document.createElement("input");
  const newDate = document.createElement("input");
  const buttonsNewCost = document.createElement("div");

  newText.id = `text__input-${_id}`;
  newText.className = "text__input";
  newText.value = text;
  newCost.id = `cost__input-${_id}`;
  newCost.className = `cost__input-${_id}`;
  newCost.value = cost;
  newDate.id = `date__input-${_id}`;
  newDate.className = `date__input-${_id}`;
  newDate.value = date;
  newExpense.className = "new-expense";
  buttonsNewCost.className = "new-cost";

  doneImage.src = "images/done.svg";
  doneImageButton.id = `cost_button_done${_id}`;
  doneImage.alt = "done image";
  doneImageButton.onclick = () => {
    updateEditCost(_id);
  };
  doneImageButton.append(doneImage);

  cancelImage.src = "images/cancel.svg";
  cancelImageButton.id = `cost_cancel${_id}`;
  cancelImage.alt = "";
  cancelImageButton.onclick = (item) => {
    cancelEdit(item);
  };
  cancelImageButton.append(cancelImage);

  buttonsNewCost.append(doneImageButton);
  buttonsNewCost.append(cancelImageButton);
  newExpense.append(newText, newDate, newCost, buttonsNewCost);
  expense.replaceWith(newExpense);
};

render = () => {
  const content = document.getElementById("content-page");

  let sumCosts = document.createElement("h2");
  let sum = 0;

  allCosts.forEach((element) => {
    sum += element.cost;
  });

  sumCosts.className = "sum-costs";
  sumCosts.innerText = `Итого: ${sum} p`;

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allCosts.forEach((item, index) => {
    const { text, cost, _id, date } = item;

    const container = document.createElement("div");
    container.id = `task-${_id}`;
    container.className = "text-container";

    const newText = document.createElement("p");
    const newDate = document.createElement("p");
    const newCost = document.createElement("p");
    const costAmount = document.createElement("p");
    costAmount.className = "cost-amount";
    newText.innerText = text;
    newDate.innerText = date;
    newCost.innerText = `${cost} р.`;
    costAmount.innerText = `${index + 1})`;

    const imageEditButton = document.createElement("div");
    imageEditButton.id = `${_id}`;
    const imageEdit = document.createElement("img");
    imageEditButton.className = "edit-button";
    imageEdit.src = "images/edit.svg";
    imageEdit.alt = "imageEdit";
    imageEditButton.onclick = () => {
      editTask(item);
    };
    imageEditButton.appendChild(imageEdit);

    const deleteTaskButton = document.createElement("div");
    deleteTaskButton.id = `${_id}`;
    deleteTaskButton.className = "button-delete";
    const deleteImg = document.createElement("img");
    deleteImg.src = "images/delete.svg";
    deleteImg.alt = "deleteImg";
    deleteTaskButton.onclick = () => {
      deleteTask(_id);
    };
    deleteTaskButton.appendChild(deleteImg);

    const taskButtons = document.createElement("div");
    taskButtons.append(imageEditButton);
    taskButtons.append(deleteTaskButton);
    taskButtons.className = "task-buttons";

    const textButtons = document.createElement("div");
    textButtons.append(newText, newDate, newCost);
    textButtons.className = "text-buttons";
    container.appendChild(costAmount);
    container.appendChild(textButtons);
    container.appendChild(taskButtons);

    content.appendChild(container);
    content.appendChild(sumCosts);
  });
};
