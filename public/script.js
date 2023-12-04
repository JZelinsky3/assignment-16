const getCars = async () => {
    try {
      const response = await fetch("/api/cars");
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response.json();
    } catch (error) {
      console.error(error);
    }
  };
  
  const showCars = async () => {
    let cars = await getCars();
    let carsDiv = document.getElementById("car-list");
    carsDiv.innerHTML = "";
    cars.forEach((car) => {
      const section = document.createElement("section");
      section.classList.add("car");
      carsDiv.append(section);
  
      const a = document.createElement("a");
      a.href = "#";
      section.append(a);
  
      const h3 = document.createElement("h3");
      h3.innerHTML = car.makeModel;
      a.append(h3);
  
      if (car.img) {
        const img = document.createElement("img");
        img.src = car.img;
        section.append(img);
      }
  
      a.onclick = (e) => {
        e.preventDefault();
        displayDetails(car);
      };
    });
  };
  
  const displayDetails = (car) => {
    const carDetails = document.getElementById("car-details");
    carDetails.innerHTML = "";
  
    const h3 = document.createElement("h3");
    h3.innerHTML = car.makeModel;
    carDetails.append(h3);
  
    const deleteLink = document.createElement("a");
    deleteLink.innerHTML = "&#x2715;";
    carDetails.append(deleteLink);
    deleteLink.id = "delete-link";
  
    const editLink = document.createElement("a");
    editLink.innerHTML = "&#9998;";
    carDetails.append(editLink);
    editLink.id = "edit-link";
  
    const p = document.createElement("p");
    carDetails.append(p);
    p.innerHTML = `Year: ${car.year}<br>Color: ${car.carColor}`;
  
    const ul = document.createElement("ul");
    carDetails.append(ul);
    car.carFeatures.forEach((feature) => {
      const li = document.createElement("li");
      ul.append(li);
      li.innerHTML = feature;
    });
  
    editLink.onclick = (e) => {
      e.preventDefault();
      document.querySelector(".dialog").classList.remove("transparent");
      document.getElementById("add-edit-title").innerHTML = "Edit Car";
    };
  
    deleteLink.onclick = (e) => {
      e.preventDefault();
      deleteCar(car);
    };
  
    populateEditForm(car);
  };
  
  const deleteCar = async (car) => {
    let response = await fetch(`/api/cars/${car._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  
    if (response.status !== 200) {
      console.error("Error deleting");
      return;
    }
  
    let result = await response.json();
    showCars();
    document.getElementById("car-details").innerHTML = "";
    resetForm();
  };
  
const populateEditForm = (car) => {
  const form = document.getElementById("add-edit-car-form");
  form._id.value = car._id;
  form.make.value = car.make;
  form.model.value = car.model;
  form.year.value = car.year;
  form.color.value = car.carColor; // Update to 'car.carColor'
  populateFeatures(car.carFeatures);
};

// Update addEditCar function
const addEditCar = async (e) => {
  e.preventDefault();
  const form = document.getElementById("add-edit-car-form");
  const formData = new FormData(form);
  formData.append("carFeatures", getCarFeatures());
  let response;
  // Trying to add a new car
  if (form._id.value == -1) {
    formData.delete("_id");
    response = await fetch("/api/cars", {
      method: "POST",
      body: formData,
    });
  } else {
    // Existing car
    response = await fetch(`/api/cars/${form._id.value}`, {
      method: "PUT",
      body: formData,
    });
  }
  if (response.status !== 200) {
    console.error("Error posting data");
    return;
  }
  car = await response.json();
  // In edit mode
  if (form._id.value !== -1) {
    // Get the car with the indicated id
    // Then display it
    displayDetails(car);
  }
  document.querySelector(".dialog").classList.add("transparent");
  resetForm();
  showCars();
};
  
  const getCarFeatures = () => {
    const inputs = document.querySelectorAll("#feature-boxes input");
    let carFeatures = [];
  
    inputs.forEach((input) => {
      carFeatures.push(input.value);
    });
  
    return carFeatures;
  };
  
  const resetForm = () => {
    const form = document.getElementById("add-edit-car-form");
    form.reset();
    form._id = "-1";
    document.getElementById("feature-boxes").innerHTML = "";
  };
  
  const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add Car";
    resetForm();
  };
  
  const addFeature = (e) => {
    e.preventDefault();
    const section = document.getElementById("feature-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
  };
  
  window.onload = () => {
    showCars();
    document.getElementById("add-edit-car-form").onsubmit = addEditCar;
    document.getElementById("add-link").onclick = showHideAdd;
  
    document.querySelector(".close").onclick = () => {
      document.querySelector(".dialog").classList.add("transparent");
    };
  
    document.getElementById("add-feature").onclick = addFeature;
  };
  