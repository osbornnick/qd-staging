fetch("/api/id")
    .then((res) => res.json())
    .then(({ id }) => {
        let linkElement = document.getElementById("linktogame");
        let game = "tsp";
        const bin = id.charAt(id.length - 1);
        if (bin > 2) game = "knapsack";
        // if (bin > 3) game = "game3";
        if (bin == 1 || bin == 4) id += "0"; // don't show behavior
        else id += "1"; // show behavior
        if (bin == 2 || bin == 5) id += "1"; // show solutions
        else id += "0";
        if (linkElement?.getAttribute("href") == "#")
            document
                .getElementById("linktogame")
                ?.setAttribute("href", `${game}.html?uid=${id}`);
    });
