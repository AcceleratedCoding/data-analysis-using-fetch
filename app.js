// document.addEventListener('DOMContentLoaded', function () {
// const tweetForm = document.getElementById('tweetForm');
// const tweetText = document.getElementById('tweetText');
// const responseDiv = document.getElementById('response');
// tweetForm.addEventListener('submit', function (event) {
// event.preventDefault();
// const tweet = tweetText.value;
// Make an HTTP POST request to the backend
// const url = 'https://one00x-data-analysis.onrender.com/assignment';
// fetch(url, {
//     method: 'get',
// })
//     .then(response => {
//         if (response.ok) {
//             const headers = response.headers;
//             console.log(response.headers.get('x-assignment-id'));

//             // headers.forEach((value, name) => {
//             //   console.log(`${name}: ${value}`);
//             // });
//             return response.json(); // Parse response as JSON

//         } else {
//             throw new Error('Tweet posting failed'); // Handle failure
//         }
//     })
//     .then(data => {
//         // Handle successful tweet post
//         // responseDiv.innerText = `Tweet posted successfully! Tweet ID: ${data.id}`;
//     })
//     .catch(error => {
//         // Handle error
//         // responseDiv.innerText = `Error: ${error.message}`;
//     });
// // });
// // });


const getJargons = async () => {
    const url = 'https://one00x-data-analysis.onrender.com/assignment?email=damodarnaik101@gmail.com';
    return await fetch(url, {
        method: 'get',
    }).then(async response => {
        if (response.ok) {
            const headers = response.headers;
            const data = await response.json();
            return {
                'assignmentID': response.headers.get('x-assignment-id'),
                'jargons': data
            }
        } else {
            return new Error('getting jargons failed'); // Handle failure
        }
    }).catch(error => {
        console.log(error)
    })
}



(async () => {
    try {
        let dataa = await getJargons();
        console.log('assignment_id: ' + dataa.assignmentID);
        let counts = {}
        let maxUsedJargon = '';
        dataa.jargons.forEach((item) => {
            if (!maxUsedJargon) {
                maxUsedJargon = item;
            }
            if (counts?.[item]) {
                if ((counts[item] + 1) > Math.max(...Object.values(counts))) {
                    maxUsedJargon = item
                }
                counts = { ...counts, [item]: (counts[item] + 1) };
            } else {
                counts = { ...counts, [item]: 1 }
            }

        })
        console.log('answer: '+ maxUsedJargon);

        const url = 'https://one00x-data-analysis.onrender.com/assignment';
        await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "assignment_id": dataa.assignmentID,
                "answer": maxUsedJargon
            }),
        }).then(async response => {

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                return new Error('submitting answer failed');
            }
        }).catch(error => {
            console.log(error);
        })

    } catch (error) {
        console.error('An error occurred:', error);
    }
})();