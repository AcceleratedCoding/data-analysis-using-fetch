const getJargons = async () => {
    try {
        const url = 'https://one00x-data-analysis.onrender.com/assignment?email=damodarnaik101@gmail.com';
        return await fetch(url, {
            method: 'get',
        }).then(async response => {
            if (response.ok) {
                const data = await response.json();
                return {
                    'assignmentID': response.headers.get('x-assignment-id'),
                    'jargons': data
                }
            } else if (response.status == 500) {
                return await getJargons();
            }
        })
    } catch (error) {
        throw new Error(error);
    }
}

const submitAnswer = async (assignmentId, answer) => {
    try {
        const url = 'https://one00x-data-analysis.onrender.com/assignment';
        return await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "assignment_id": assignmentId,
                "answer": answer
            }),
        }).then(async response => {

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return data.result
            }
        })
    } catch (error) {
        throw new Error(error);
    }

}

(async () => {
    try {
        let dataa = await getJargons();
        console.log('assignment_id: ' + dataa.assignmentID);
        const allJargons = dataa.jargons;
        let counts = new Map();
        if (allJargons?.length >= 1) {
            allJargons.forEach((item) => {
                counts.has(item) ? counts.set(item, (counts.get(item) + 1)) : counts.set(item, 1);
            })

            maxCount = Math.max(...counts.values());
            const maxUsedJargons = [...counts?.entries(counts)]?.filter(
                (item) => item[1] == maxCount)?.map(
                    (item) => {
                    return item[0];
                });

            let i = 0;
            while (i < (maxUsedJargons.length)) {
                let result = await submitAnswer(dataa.assignmentID, maxUsedJargons[i]);
                if (result == 'submitted_correct') {
                    break;
                } else {
                    i += 1;
                }
            }

        } else {
            console.log("Jargons array received is empty")
        }


    } catch (error) {
        console.error('An error occurred:', error);
    }
})();