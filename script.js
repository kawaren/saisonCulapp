////UIプレビュー用
let dataArray = [
    ['2024/12/04', 'GOOGLE PAYMENT SPLITIT', 6050, '未選択'],
    ['2024/12/05', 'ETC西日本  (大洲→松山)', 1300, '未選択'],
    ['2024/12/05', 'ETC西日本  (大洲松尾→大洲松尾)', 590, '未選択'],
    ['2024/12/08', 'ETC特別割引 (松山→大洲)', 910, '未選択'],
    ['2024/12/08', 'ETC特別割引 (大洲松尾→大洲松尾)', 410, '未選択'],
    ['2024/12/08', 'QP/シンチトセ クウコウ ターミナル', 2160, '未選択'],
    ['2024/12/10', 'QP/ローソン', 310, '未選択'],
    ['2024/12/11', 'QP/ココイチバンヤウワジマコクド', 736, '未選択'],
    ['2024/12/11', 'QP/ローソン', 310, '未選択']
]


const categories = [
    { name: "食費", id: "button-food" },
    { name: "会社建替", id: "button-com" },
    { name: "自宅建替", id: "button-home" },
    { name: "遊び", id: "button-hobby" },
    { name: "日用品", id: "button-dairy" },
    { name: "自己投資", id: "button-investment" }
]

//イベント
//ファイル選択時に実行
//document.getElementById("fileInput").addEventListener("change", (e) => {
//    const file = e.target.files[0];
//    if (!file) return;
//
//    const reader = new FileReader();
//
//    // ファイルをバイナリデータで読み込み
//    reader.readAsArrayBuffer(file);
//
//    // ファイル読み込み完了後の処理
//    reader.onload = (e) => {
//        const arrayBuffer = e.target.result;
//        //バイナリをデコード
//        const csvData = decodeCSVData(arrayBuffer);
//        // CSVデータを処理して配列化
//        let dataArray = getArrayFromCSV(csvData)

        //tableの中身を生成
        createContent(dataArray, categories);

        //ボタンをクリックした時の処理
        //cssの適用& dataArrayを書き換え
        document.querySelectorAll(".categoryBtn").forEach((btn, btnIndex, btns) => {
            btn.addEventListener("click", (event) => {
                // クリックされたボタンを特定
                console.log("Clicked button:", event.target.textContent);
                console.log(`ボタンインデックス：${btnIndex}`)

                //0~5
                const categoryBtnIndex = (btnIndex + 6) % 6
                console.log(`categoryBtnIndex:${categoryBtnIndex}`);

                const btnsIndex = Math.ceil(((btnIndex + 1) / 6) - 1);
                console.log(`btnsIndex:${btnsIndex}`);

                const startBtnIndex = btnIndex - categoryBtnIndex;
                console.log(startBtnIndex);
                for (let i = startBtnIndex; i <= startBtnIndex + 5; i++) {
                    btns[i].classList.remove("active");
                };
                btn.classList.add("active");
                dataArray[btnsIndex][3] = categories[categoryBtnIndex].name

                console.log("arrが変更されたよ");
                console.log(dataArray);
            });
        });

        //「計算」ボタンを生成
        const culButton = document.createElement("button");
        const end = document.getElementById("end");
        end.appendChild(culButton);
        culButton.textContent = "計算"

        //ボタンを押した後の処理
        culButton.addEventListener("click", () => {
            const culcurateResult = getCulcurateResult(dataArray);
            window.alert(`
                総計：${culcurateResult.sum} 円
                --------------------------
                食費：${culcurateResult.foodSum} 円 (${(culcurateResult.foodSum / culcurateResult.subSum * 100).toFixed(1)} %)
                趣味：${culcurateResult.hobbySum} 円 (${(culcurateResult.hobbySum / culcurateResult.subSum * 100).toFixed(1)} %)
                日用品：${culcurateResult.dairySum} 円 (${(culcurateResult.dairySum / culcurateResult.subSum * 100).toFixed(1)} %)
                自己投資：${culcurateResult.investmentSum} 円 (${(culcurateResult.investmentSum / culcurateResult.subSum * 100).toFixed(1)} %)
                --------------------------
                小計：${culcurateResult.subSum} 円
        
                会社立替：${culcurateResult.comSum} 円
                自宅立替：${culcurateResult.homeSum} 円
                --------------------------
                検算用全合計：${culcurateResult.foodSum + culcurateResult.hobbySum + culcurateResult.dairySum + culcurateResult.investmentSum + culcurateResult.comSum + culcurateResult.homeSum} 円
        
            `);
        });
//    };
//});

function getArrayFromCSV(csvData) {
    // 改行文字でデータを行ごとに分割かつ、,ごとに分裂し２次元配列を生成
    let rows = csvData.trim().split("\n").map(row =>
        row.split(",")
    );

    //欲しい形に、加工
    rows = rows.slice(5);
    //欲しい列0,1,5
    rows = rows.map(subArr =>
        subArr.filter((_, index) =>
            [0, 1, 5].includes(index)
        )
    );

    rows.forEach((e) => {
        e.push("未選択")
    });

    rows = rows.map(subArray => [
        subArray[0],  // 日付
        subArray[1],  // 説明
        Number(subArray[2]),  // 3番目の要素を数値に変換
        subArray[3]
    ]);

    return rows
};

function decodeCSVData(arrayBuffer) {
    const decoder = new TextDecoder('shift_jis');
    return decoder.decode(arrayBuffer);
};

function createContent(dataArray, categories) {
    const table = document.getElementById("table");

    dataArray.forEach((subArr) => {

        const tbody = document.createElement("tbody");
        const trElements = document.createElement("tr");
        const trBtns = document.createElement("tr");

        table.appendChild(tbody);
        tbody.appendChild(trElements);
        tbody.appendChild(trBtns);

        subArr.slice(0, 3).forEach((element, subArrIndex) => {
            const td = document.createElement("td");
            td.setAttribute("class", `td-${subArrIndex}`)

            switch (subArrIndex) {
                case 0:
                    //幅を抑えるため2行にしたい
                    const dateParts = element.split("/");
                    td.textContent = element;
                    const formattedString = dateParts[0] + "/" + "\n" + dateParts[1] + "/" + dateParts[2];
                    td.textContent = formattedString;
                    break;
                case 1:
                    td.textContent = element;
                    break;
                case 2:
                    td.textContent = `${element.toLocaleString()} 円`;
                    break
                default:
                    td.textContent = "エラー";

            };

            trElements.appendChild(td);
        });

        const td = document.createElement("td");
        td.setAttribute("id", "btns-td");
        td.setAttribute("class", "btns-td");
        td.setAttribute("colspan", "3");
        trBtns.appendChild(td);

        categories.forEach((object) => {
            const button = document.createElement("Button");
            button.textContent = object.name;
            //button.setAttribute("id", `categoryBtn`)
            button.setAttribute("class", "categoryBtn")
            td.appendChild(button);
        });
    });
};

function getCulcurateResult(dataArray) {
    const foodArray = dataArray.filter(subArray => subArray[3] === categories[0].name);
    const comArray = dataArray.filter(subArray => subArray[3] === categories[1].name);
    const homeArray = dataArray.filter(subArray => subArray[3] === categories[2].name);
    const hobbyArray = dataArray.filter(subArray => subArray[3] === categories[3].name);
    const dairyArray = dataArray.filter(subArray => subArray[3] === categories[4].name);
    const investmentArray = dataArray.filter(subArray => subArray[3] === categories[5].name);

    const sum = dataArray.reduce((acc, subArray) => acc + subArray[2], 0);
    const foodSum = foodArray.reduce((acc, subArray) => acc + subArray[2], 0);
    const comSum = comArray.reduce((acc, subArray) => acc + subArray[2], 0);
    const homeSum = homeArray.reduce((acc, subArray) => acc + subArray[2], 0);
    const hobbySum = hobbyArray.reduce((acc, subArray) => acc + subArray[2], 0);
    const dairySum = dairyArray.reduce((acc, subArray) => acc + subArray[2], 0);
    const investmentSum = investmentArray.reduce((acc, subArray) => acc + subArray[2], 0);
    const subSum = foodSum + hobbySum + dairySum + investmentSum

    return { sum, foodSum, comSum, homeSum, hobbySum, dairySum, investmentSum, subSum }



}