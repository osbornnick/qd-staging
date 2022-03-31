fetch("/api/id")
    .then((res) => res.json())
    .then(({ id }) => {
        let linkElement = document.getElementById("linktogame");
        let game = "tsp";
        if (id.charAt(id.length - 2) == 1) game = "knapsack";
        if (linkElement?.getAttribute("href") == "#")
            document
                .getElementById("linktogame")
                ?.setAttribute("href", `${game}.html?uid=${id}`);
    });
