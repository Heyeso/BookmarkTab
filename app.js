$(document).ready(()=>{

    // temporary
    let db = [
        {
            icon: "",
            name: "Goolge",
            urlLink: "https://www.google.com/search?rlz=1C1CHBF_enUS869US869&sxsrf=ALeKk01xamgRPwfhtlE8PZfGj2iaDHywyQ:1607813609415&q=foolish&spell=1&sa=X&ved=2ahUKEwicibe4xMntAhWP2FkKHSvFDjQQBSgAegQICBAw&biw=1920&bih=969"
        },
        {
            icon: "",
            name: "Font Awesome",
            urlLink: "https://fontawesome.com/"
        },
        {
            icon: "",
            name: "Google Fonts",
            urlLink: "https://fonts.google.com/specimen/Open+Sans?preview.text=Google&preview.text_type=custom&sidebar.open=true&selection.family=Open+Sans:wght@300;400;600"
        }
    ]
    
    let renderItems = () => {
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
                <a class=${"info"} href=${val.urlLink} target=${"_blank"} rel=${"noopener noreferrer"}>
                    
                    <p class=${"name"}>${namestr}</p>
                    <p class="link">${tabURLstr}</p>
                </a>
                <button class=${"delete"} title=${"delete"}>Delete</button>
            </a>
            `;
            $(".items").append(newItem);
        })
        
    }
    renderItems();




    // add tab to list
    $("body").delegate(".add button", "click", function() {

        // Temporary
        let tabName = "Youtube | EXTREME Aged Meat BBQ!! Have We Gone Too Far??",
         tabURL = "https://www.youtube.com/watch?v=x9ulDGh20BE",
         tabIcon = "";
        
        let input = $(".add input").val()
            if(input !== "") {
                tabName = input
        }

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
            // rerender
            $(".items").empty()
            renderItems();
        } 
        else
            console.log("item Exists")
        
    })

    // delete tab from list
    $("body").delegate(".item .delete", "click", function(element) {
        // get item to delete
        let itemUrl = $(element.currentTarget).parent().children("a").attr("href");
            
        // remove from database
        for (let val of db) {
            if(val.urlLink === itemUrl) {
                db.splice(db.indexOf(val), 1)
                break;
            }
        }

        // rerender list
        $(".items").empty()
        renderItems();
    })


    // context menu that can add page to bookmark without openinig popup on right click
    // notification when this is added
})