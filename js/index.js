// API choice link
let baseURL = "https://www.breakingbadapi.com/api/characters?limit=10&offset=10";

// data array to hold user data entered on the form
var dataArray = [];


// API related function
// fetches api data
const getData = async () => {
    const response = await fetch(baseURL);
    const data = await response.json();
    output(data);
}

// Prints API data on the page
function output(data) {
    var html = "";
    let htmlSegment = "";

    data.forEach(data => { //iterates over the  array of objects
        htmlSegment = `<div class='col1'>
                            <h2>ID: ${data.char_id}</h2>
                            <h2>Name: ${data.name}</h2>
                            <h2>DOB: ${data.birthday}</h2>
                            <h2>Occupation: ${data.occupation}</h2>
                            <img src=${data.img} class="APIimage">
                            <h2>Status: ${data.status}</h2>
                            <h2>Nickname: ${data.nickname}</h2>
                            <h2>Season(s): ${data.appearance}</h2>
                            <h2>Character: ${data.portrayed}</h2>
                            <h2>Series: ${data.category}</h2>
                        </div> <br>`;
        html += htmlSegment;
    });
    $('.charactersDiv').append(html);
};
// API related functions end


// To process and store data input to form after validation
// also calls the display function to display data on the table
function processForm(data) {
    var person = new Object;
    person.fName = data.fName.value;
    person.lName = data.lName.value;
    person.state = data.state.value;
    person.email = data.email.value;
    person.age = data.age.value;

    dataArray.push(person);

    localStorage.persons = JSON.stringify(dataArray);
    alert("Data stored..");
    $('#censusForm').trigger("reset");
    displayData();

}

// to enter the data into the table
function displayData() {
    if (localStorage.getItem("persons")) {
        var output = $("tbody")[0];
        output.innerHTML = "";
        JSON.parse(localStorage.persons).forEach(person => {
            output.innerHTML += "<tr>" +
                "<td>" + person.fName + "</td>" +
                "<td>" + person.lName + "</td>" +
                "<td>" + person.state + "</td>" +
                "<td>" + person.email + "</td>" +
                "<td>" + person.age + "</td>" +
                "</tr>"
        });
        $("#dataTable").table().table("refresh");
    }

};


$(document).ready(function () {
    $("#menuPanel").panel();
    $("#menuListview").listview().listview("refresh");

    $(".menu").click(function (e) {
        $("#menuPanel").panel("open");
    });

    
    // Loads data from local storage when document loads and displays on  form data table
    if (localStorage.persons) {
        dataArray = JSON.parse(localStorage.persons);
        displayData();
    }

    //  Image carousel functions
    // Reference to first image in the file
    var firstImg = $("#first");
    // Reference to first image in the file
    var lastImg = $("#last");

    // Functionality of Next arrow on image
    $(".next").on("click", function () {
        var currentImg = $(".active");
        var nextImg = currentImg.next();

        currentImg.fadeOut(200).removeClass("active").css("z-index", -10);
        if (nextImg.length) {
            nextImg.fadeIn(200).addClass("active").css("z-index", 10);
        }
        else {

            firstImg.fadeIn(200).addClass("active").css("z-index", 10);
        }
    });

    // Functionality of Previous arrow on image
    $(".prev").on("click", function () {
        var currentImg = $(".active");
        var prevImg = currentImg.prev();

        currentImg.fadeOut(200).removeClass("active").css("z-index", -10);
        if (prevImg.length) {
            prevImg.fadeIn(200).addClass("active").css("z-index", 10);
        }
        else {
            lastImg.fadeIn(200).addClass("active").css("z-index", 10);
        }
    });


    // Implements touch functionality on about me picture
    $(".demo").on("touchstart", function () {
        $("#textOverlay").removeClass("overlay");
        $("#textOverlay").addClass("overlayHover");
        $("#myPic").addClass("imgHover");
    })

    // Implements touch functionality on about me picture
    $(".demo").on("touchend", function () {
        $("#textOverlay").addClass("overlay");
        $("#textOverlay").removeClass("overlayHover");
        $("#myPic").removeClass("imgHover");
    })

    // Menu panel links functionality
    // Makes the pic on menu panel clickable to go back home
    $("#homeLink").click(function (e) {
        $("body").pagecontainer("change", "#home");
    });

    $("#aboutLink").click(function (e) {
        $("body").pagecontainer("change", "#aboutMe");
    });

    $("#formLink").click(function (e) {
        $("body").pagecontainer("change", "#form");
    });

    $("#formDataLink").click(function (e) {
        $("body").pagecontainer("change", "#formData");
    });

    // As the API page link is clicked on, the getData() function is called to display API data on the page 
    $("#apiDataLink").click(function (e) {
        $("body").pagecontainer("change", "#apiData");
        $('.charactersDiv').html(""); // Clearing the list
        getData();
    });

    $("#imageCarouselLink").click(function (e) {
        $("body").pagecontainer("change", "#imgCarousel");
    });

    // clears all data from the localstorage and reloads the table
    $("#clearAll").on("click", function (event) {
        localStorage.clear();
        dataArray = [];

        $("tbody").load("http://127.0.0.1:5500/index.html tbody");
        alert("All data cleared..");

    });
    // Menu panel links - End

    // validation rules for entering data into form
    $("form[name='censusForm']").validate({
        rules: {
            fName: "required",
            lName: "required",
            state: "required",
            email: {
                required: true,
                email: true
            },
            age: {
                required: true,
                range: [14, 120],
                digits: true
            }
        },
        messages: {
            fName: "Please enter your first name",
            lName: "Please enter your last name",
            state: "Please select your State",
            email: {
                required: "Please enter your Email Address",
                email: "Please enter a valid Email Address"
            },
            age: {
                required: "Please enter your age",
                range: "Ages must be greater than 14 and less than 120",
                digits: "Please enter digits only"
            },
        },

        submitHandler: function (form) {
            form.submit();
        }
    });

    // clears the form
    $("#clearForm").click(function (e) {
        e.preventDefault();
        $("#censusForm").trigger("reset");
    });


});

// implements swipe functionality on the menupanel
$(document).on("swipeleft swiperight", function (e) {

    if ($.mobile.activePage.jqmData("panel") !== "open") {
        if (e.type === "swiperight") {
            e.preventDefault();
            $("#menuPanel").panel("open");
        }
    }
});