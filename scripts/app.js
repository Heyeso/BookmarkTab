//Format long strings to fit Tab Element Width
const FormatLongStringURL = (str) =>
  str.length > 55 ? str.substring(0, 53) + "..." : str;

const FormatLongString = (str) =>
  str.length > 40 ? str.substring(0, 36) + "..." : str;

//Default Tab item for empty list
const DEFAULT_TAB_ITEM = {
  icon: "https://myportfolio-e35e6.web.app/images/iconLogo.png",
  name: "Abdulsalam | Portfolio",
  urlLink: "https://myportfolio-e35e6.web.app/",
};

// Break Line Element between Items
const BREAK_LINE = `<div class="${"break"}"></div>`;

// new Tab Item Element
const TAB_ITEM = (icon, name, urlLink) => `
<div class="${"tab"}">
    <img class="${"logo"}" alt="${"logo icon"}" src="${
  icon ? icon : "assets/placeholder.svg"
}">
    <div class="${"body"}">
        <h3 class="${"title"}" title="${name}">${FormatLongString(name)}</h3>
        <a target="${"_blank"}" rel="${"noopener noreferrer"}" class="${"url"}" href="${urlLink}" title="${urlLink}" >${FormatLongStringURL(
  urlLink
)}</a>
    </div>
    <div class="${"icon delete"}">
        <img class="${"icon"}" alt="${"delete icon"}" src="${"/assets/delete.icon.svg"}">
    </div>
</div>
`;

//Render tab items stored in chrome storage.
const RENDER_ALL_ITEMS = (db, index) => {
  db.forEach((val) => {
    $("#tab-container").append(TAB_ITEM(val.icon, val.name, val.urlLink));
    if (index < db.length - 1) $("#tab-container").append(BREAK_LINE);
  });
};

// Get stored/bookmarked tabs from Chrome Storage.
const GET_STORAGE_ITEMS = () => {
  chrome.storage.local.get("TAB_LIST", (element) => {
    if (typeof element.TAB_LIST === "undefined")
      chrome.storage.local.set({ TAB_LIST: [DEFAULT_TAB_ITEM] }, (el) => {
        RENDER_ALL_ITEMS([DEFAULT_TAB_ITEM]);
      });
    else RENDER_ALL_ITEMS(element.TAB_LIST);
  });
};

// Render a single item
let RENDER_ITEM = (val) => {
  $("#tab-container").append(TAB_ITEM(val.icon, val.name, val.urlLink));
};

$(document).ready(() => {
  //Dark Mode
  if (!(new Date().getHours() > 6 && new Date().getHours() < 18))
    $(".container").addClass("dark");

  GET_STORAGE_ITEMS();

  // add tab to list
  $("body").delegate("#add-icon", "click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
      let tabName = tab[0].title,
        tabURL = tab[0].url,
        tabIcon = tab[0].favIconUrl;

      // Check if Tab has Icon
      if (tabIcon === "") tabIcon = "assets/placeholder.svg";

      //Set Bookmark tab name
      let input = $("#input").val();
      if (input !== "") {
        tabName = input;
      }

      //Add new Tab to Storage
      chrome.storage.local.get("TAB_LIST", (element) => {
        let db = element.TAB_LIST;

        let newItem = {
          icon: tabIcon,
          name: tabName,
          urlLink: tabURL,
        };
        let notContain = true;
        for (let val of db) {
          if (val.urlLink === newItem.urlLink) {
            notContain = false;
            break;
          }
        }
        // confirm no duplicate
        if (notContain && newItem.urlLink.includes("http")) {
          // add new item and rerender if no duplicate
          db.push(newItem);
          chrome.storage.local.set({ TAB_LIST: db });
          // render single item in
          RENDER_ITEM(newItem);
        }

        //Clear Input
        $("#input").val("");
      });
    });
  });

  // delete tab from list
  $("body").delegate(".icon.delete", "click", function (element) {
    // get item to delete
    let itemUrl = $(element.currentTarget)
      .parent()
      .children("div.body")
      .children("a.url")
      .attr("href");
    $(element.currentTarget).parent().remove();

    chrome.storage.local.get("TAB_LIST", (el) => {
      let db = el.TAB_LIST;
      // remove from database
      let index = 0;
      for (let val of db) {
        if (val.urlLink === itemUrl) {
          db.splice(index, 1);
          chrome.storage.local.set({ TAB_LIST: db });
          break;
        }
        index++;
      }
    });
  });
  // context menu that can add page to bookmark without opening popup on right click
});
