// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 구성 정보 설정
const firebaseConfig = {
    apiKey: "AIzaSyDFT1tdXMTuTc4b-m3BwfotfL9wbQwRGy0",
    authDomain: "sparta-cc99f.firebaseapp.com",
    projectId: "sparta-cc99f",
    storageBucket: "sparta-cc99f.appspot.com",
    messagingSenderId: "884692541866",
    appId: "1:884692541866:web:809ab17579458cbca10bd3"
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//댓글 저장
$("#commentBtn").click(async function () {
    let replyId = $('#replyId').val();
    let replyPassword = $('#replyPassword').val();
    let replyContent = $('#replyContent').val();
    let uuid = self.crypto.randomUUID();

    if (replyId == "") {
        alert("아이디를 입력하세요");
        return;
    }
    if (replyPassword == "") {
        alert("암호를 입력하세요");
        return;
    }
    if (replyContent == "") {
        alert("댓글내용이 존재하지 않습니다");
        return;
    }

    let doc = {
        'replyId': replyId,
        'replyPassword': replyPassword,
        'replyContent': replyContent,
        'uuid': uuid,
    };

    await addDoc(collection(db, "comments"), doc)
    alert("댓글이 저장되었습니다.");
    window.location.reload();
});

//댓글 표시
let docs_reply = await getDocs(collection(db, "comments"));
docs_reply.forEach((docx) => {
    let row = docx.data();
    let replyId = row['replyId'];
    let replyPassword = row['replyPassword'];
    let replyContent = row['replyContent'];
    const uuid = row['uuid'];

    const div = document.createElement('div');

    let temp_html = `
    <div class="card mt-2">
        <div class="card-header p-2">
            <table>
                <tbody><tr class="align-middle">
                    <td rowspan="2" class="pr-2"><i class="fa fa-user-o fa-2x" style="font-size: 30px;"></i></td>
                    <td class="ml" style="font-size: 20px;">&nbsp;${replyId}&nbsp;&nbsp;</td>
                    <td>
                        <span><i class="fa fa-window-close fa" aria-hidden="true"></i></span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="card-body">
            <p class="card-text">${replyContent}</p>
        </div>
    </div>`;

    $(div).append(temp_html);

    let deleteBtn = div.querySelector('.fa-window-close');

    deleteBtn.addEventListener('click', () => {
        let pass = "";
        let result = prompt("비밀번호를 입력하세요.", "");
        getDocs(collection(db, "comments")).then((data) => {
            for (let i = 0; i < data.docs.length; i++) {
                if (uuid == data.docs[i]._document.data.value.mapValue.fields.uuid.stringValue) {
                    pass = data.docs[i]._document.data.value.mapValue.fields.replyPassword.stringValue;
                    // 파이어베이스 데이터 구조 해부해보기 console.log(data);
                    if (result == data.docs[i]._document.data.value.mapValue.fields.replyPassword.stringValue) {
                        deleteDoc(doc(db, "comments", data.docs[i]._key.path.segments[6]));
                        alert("댓글이 삭제되었습니다.");
                    }
                    else {
                        alert("비밀번호가 다릅니다.");
                    }
                }
            }
        })
    })
    $('#replyBoard').append(div);
});


$("#postingbtn").click(async function () {
    let image = $('#image').val();
    let name = $('#name').val();
    let MBTI = $('#MBTI').val();
    let TMI = $('#TMI').val();

    let doc = {
        'image': image,
        'name': name,
        'MBTI': MBTI,
        'TMI': TMI
    };
    await addDoc(collection(db, "membercard"), doc);
    alert('추가 완료!');
    window.location.reload();
})

$("#savebtn").click(async function () {
    $('#tbox').toggle();
})

$("#endbtn").click(async function () {
    $('#tbox').slideUp();
})

$(document).on('click', '.view-details', async function () {
    let name = $(this).data('name');

    let memberInfo = await getMemberInfoFromFirebase(name);

    if (memberInfo) {
        createMemberDetailPage(memberInfo);
    } else {
        alert('오류');
    }
});

async function getMemberInfoFromFirebase(name) {
    try {
        const querySnapshot = await getDocs(collection(db, "membercard"));
        const members = querySnapshot.docs.map((doc) => doc.data());
        const memberInfo = members.find((member) => member.name === name);

        return memberInfo;
    } catch (error) {
        console.error("Error fetching member info:", error);
        return null;
    }
}

function createMemberDetailPage(member) {
    const memberDetailURL = `./member/${member.name}.html`;

    const memberDetailPage = `
    <!DOCTYPE html>
    <html.lang="ko">
    <head>
        <title>${member.name}의 자기소개</title>
        <meta charset="utf-8">
            <meta name="author" content="${member.name}">
                <meta name="description" content="MyHtml">
                    <link rel="stylesheet" type="text/css" href="./style.css">
                        <style>
                            h3 {
                                color: black;
                            text-align: center;
        }
                            .introduce {
                                text - align: center;
                            width: 500px;
        }
                        </style>
                    </head>
                    <body>
                        <div class="MyProfile" align="center">
                            <h1 align="center">${member.name}의 자기소개</h1>
                            <div class="ProfilePicture">
                                <h3>프로필 사진</h3>
                                <img src="${member.image}" width="200" height="200">
                            </div>
                            <br>

                                <div class="MyInfo" align="center">
                                    <h3>내 정보</h3>
                                    <span><b>스파르타코딩클럽 Node_js 3기 ${member.name}</b></span>
                                </div>
                                <br><br>

                                    <div class="introduce">
                                        <h3>자기소개</h3>
                                        <i> ${member.TMI}</i>
                                    </div>
                                    <br><br>
                                    </div>
                                    </body>
                                </html>
                                    `;

    const blob = new Blob([memberDetailPage], { type: 'text/html' });

    const url = URL.createObjectURL(blob);
    window.location.href = url;
}

// ...
let docs = await getDocs(collection(db, "membercard"));
docs.forEach((doc) => {
    let row = doc.data();

    let image = row['image'];
    let name = row['name'];
    let MBTI = row['MBTI'];
    let TMI = row['TMI'];

    let tmep_html = `
                                    <div class="col">
                                        <div class="card h-100">
                                            <img src="${image}" class="card-img-top" alt="...">
                                                <div class="card-body">
                                                    <h5 class="card-title">${name}</h5>
                                                    <p class="card-text">${MBTI}</p>

                                                </div>
                                                <div class="card-footer">
                                                    <button class="btn btn-primary view-details"
                                                        data-name="${name}" data-image="${image}" data-mbti="${MBTI}" data-tmi="${TMI}">
                                                        자세히 보기
                                                    </button>
                                                </div>
                                        </div>
                                    </div>`;
    $('#card').append(tmep_html);
});
