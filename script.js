const btn = document.querySelector(".convert-btn");
const input = document.querySelector("input");
const dropDown = document.querySelectorAll(".form-group select");
const date = new Date();
const shortDay = date.toLocaleDateString("en-US", { weekday: "short" });
const today = date.getDate();
const shortMonth = date.toLocaleString("en-US", { month: "short" });
const year = date.getFullYear();
let fromCurr;
let toCurr;

for (const select of dropDown) {
    for (const country in countryList) {
        const options = document.createElement("option");
        options.value = country;
        options.innerText = `${country} - ${countryList[country]}`;
        if (select.name === "from" && options.value === "USD") {
            options.selected = "selected";
            fromCurr = options.value;
        } else if (select.name === "to" && options.value === "INR") {
            options.selected = "selected";
            toCurr = options.value;
        }
        select.append(options);
    }
    select.addEventListener("change", evt => {
        changeSelect(evt.target);
    });
}
const changeSelect = element => {
    let currCode = element.value;
    if (element.name == "from") {
        fromCurr = currCode;
    } else if (element.name == "to") {
        toCurr = currCode;
    }
};
const updateExchangeRate = async () => {
    let amount = input.value;
    if (amount == "" || amount < 1) {
        amount = 1;
        input.value = "1";
    }

    try {
        const response = await fetch(
            `https://api.exchangerate.host/convert?access_key=/*your api access_key*/&from=${fromCurr}&to=${toCurr}&amount=${amount}`
        );

        let data = await response.json();
        if (!data.success) {
            throw new Error(`Response status: ${data.error.code}`);
        } else if (data.success) {
            document.querySelector(".result-amount").innerText =
                `${amount} ${fromCurr} = ${data.result} ${toCurr}`;
            document.querySelector(".result-rate").innerText =
                `1 ${fromCurr} = ${data.info.quote} ${toCurr}`;
            document.querySelector(".footer").innerText =
                `Updated on ${shortDay}, ${today} ${shortMonth} ${year} 00:00:01`;
        }
    } catch (error) {
        document.querySelector(".result").innerHTML =
            `<p>Something went wrong !</p>`;
        console.log(error.message);
    }
};

window.addEventListener("load", () => {
    updateExchangeRate();
});

btn.addEventListener("click", evt => {
    updateExchangeRate();
});
