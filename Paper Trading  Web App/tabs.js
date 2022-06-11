let webAppContent = document.querySelectorAll(".webApp");
let mainTabs = document.querySelectorAll("[data-main-tab]");
let accountModal = document.querySelector("#accountModal");
removeAppContent();
let clickHistory = [];

for (let i = 0; i < mainTabs.length; i++) {
    mainTabs[i].addEventListener('click', function () {
        removeAppContent();
        document.querySelector(mainTabs[i].dataset.mainTab).style.display = "block";
        // makes sure each button has regular class and adds the button that was clicked another class removing the default class
        mainTabs.forEach(function (tab) {
            tab.classList.remove("mainTabStyle");
            tab.classList.add("mainTab");
        })
        event.srcElement.classList.add("mainTabStyle");
        event.srcElement.classList.remove("mainTab");
        if (accountModal.classList.contains("moveUp")) {
            changeClass("#accountModal", "moveUp", "remove");  
        }
        clickHistory.push(i);
        if (clickHistory.length > 2) {
            clickHistory.shift();
        }
        console.log(clickHistory);
    })
}

// displays the default tab open via click
mainTabs[0].addEventListener('click', function () {
    changeClass("#accountModal", "moveUp", "add")
})
mainTabs[3].click();
function removeAppContent() {
    webAppContent.forEach(function (mainContent) {
        mainContent.style.display = "none";
    }) 
}

//for mover tab
let moverContent = document.querySelectorAll(".moverContent");
let moverButtons = document.querySelectorAll("[data-tab-target]");
removeMoverContent();
document.getElementById("gainers").style.display = "block";

moverButtons.forEach(function (moverButton) {
    moverButton.addEventListener('click', function () {
        removeMoverContent();
        document.querySelector(moverButton.dataset.tabTarget).style.display = "block";
    })
})

function removeMoverContent() {
    moverContent.forEach(function (content) {
        content.style.display = "none";
    })
}
// modal
function changeClass(that, className, action) {
    var classFunction = "document.querySelector('" + that + "')" + ".classList." + action + "('" + className + "')";
    console.log(classFunction);
    eval(classFunction);
}

function clickTaab() {
    if (!accountModal.classList.contains("moveUp")) {
        mainTabs[0].click();
    }
    else if (accountModal.classList.contains("moveUp")) {
        changeClass("#accountModal", "moveUp", "remove");
        mainTabs[clickHistory[clickHistory.length - 2]].click(); 
    }
}
 
 