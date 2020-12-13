$(".message").fadeOut(0)
$(document).ready(()=>{

    // default storage.
    let initialStorage = () => {
        let intialList = [
            {
                icon: "images/googleIcon.png",
                name: "Goolge",
                urlLink: "https://www.google.com/"
            }
        ]
        chrome.storage.local.get('tabList', (element)=> {
            if(typeof element.tabList === "undefined")
                chrome.storage.local.set({"tabList": intialList}, (el) => {
                    renderItems(intialList);
                })
            else
                renderItems(element.tabList);
        })
    }
    initialStorage();

    let renderItems = (db) => {
        db.forEach((val) => {
            let tabURLstr, namestr;
            if(val.urlLink.length > 40)
                tabURLstr = val.urlLink.substring(0, 36) + "...";
            else
                tabURLstr = val.urlLink
            if(val.name.length > 25)
                namestr = val.name.substring(0, 23) + "...";
            else
                namestr = val.name

            let newItem = `
            <div class=${"item"} >
                <img src=${val.icon} alt="Logo">
                <a  class=${"info"} href=${val.urlLink} target=${"_blank"} rel="${"noopener noreferrer"}">
                    
                    <p title="${val.name}" class=${"name"}>${namestr}</p>
                    <p class="link">${tabURLstr}</p>
                </a>
                <button class=${"delete"} title=${"delete"}><i class="far fa-trash-alt"></i></button>
            </a>
            `;
            $(".items").append(newItem);
        })
        
    }

    let renderItem = (val) => {
        let tabURLstr, namestr;
        if(val.urlLink.length > 40)
            tabURLstr = val.urlLink.substring(0, 36) + "...";
        else
            tabURLstr = val.urlLink
        if(val.name.length > 25)
            namestr = val.name.substring(0, 23) + "...";
        else
            namestr = val.name

        let newItem = `
        <div class=${"item"} >
            <img src=${val.icon} alt="Logo">
            <a  class=${"info"} href=${val.urlLink} target=${"_blank"} rel="${"noopener noreferrer"}">
                
                <p title="${val.name}" class=${"name"}>${namestr}</p>
                <p class="link">${tabURLstr}</p>
            </a>
            <button class=${"delete"} title=${"delete"}><i class="far fa-trash-alt"></i></button>
        </a>
        `;
        $(".items").append(newItem);
    }




    // add tab to list
    $("body").delegate(".add button", "click", function() {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {

            let tabName = tab[0].title,
            tabURL = tab[0].url,
            tabIcon = tab[0].favIconUrl;
        

            let input = $(".add input").val()
                if(input !== "") {
                    tabName = input
            }

            chrome.storage.local.get('tabList', (element)=> {
                let db = element.tabList;
                console.log(db)
                
                let newItem = {
                    icon: tabIcon,
                    name: tabName,
                    urlLink: tabURL
                }
                let notContain = true;
                for (let val of db) {
                    if(val.urlLink === newItem.urlLink) {
                        notContain = false;
                        break;
                    }
                }
                // confirm no duplicate
                if(notContain) {
                    // add new item and rerender if no duplicate
                    db.push(newItem)
                    chrome.storage.local.set({"tabList": db})
                    // render single item in
                    renderItem(newItem);
                    
                } 
                else {
                    $(".message").fadeIn(500)
                    setTimeout(()=> {
                        $(".message").fadeOut(500)
                    }, 2000)
                }
                    

                $(".add input").val("")  
            })

        });     
    })

    // delete tab from list
    $("body").delegate(".item .delete", "click", function(element) {
        // get item to delete
        let itemUrl = $(element.currentTarget).parent().children("a").attr("href");
        $(element.currentTarget).parent().remove()

        chrome.storage.local.get('tabList', (el) => {
            let db = el.tabList;
            // remove from database
            for (let val of db) {
                if(val.urlLink === itemUrl) {
                    db.splice(db.indexOf(val), 1)
                    chrome.storage.local.set({"tabList": db})
                    break;
                }
            }
        });


    })


    // context menu that can add page to bookmark without openinig popup on right click
    // notification when this is added
})