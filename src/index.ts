fetch("/api/id")
    .then((res) => res.json())
    .then(({ id }) => {
        let linkElement = document.getElementById("linktogame");
        if (linkElement?.getAttribute("href") == "#")
            document
                .getElementById("linktogame")
                ?.setAttribute("href", `game.html?uid=${id}`);
    });
