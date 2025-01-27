$(() => {
    const apiUrl = 'https://opentdb.com/api.php';
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];

    // Start Quiz Button
    $('#start-quiz').click(() => {
        const category = $('#category').val();
        const difficulty = $('#difficulty').val();

        fetchQuestions(category, difficulty);
    });

    function fetchQuestions(category, difficulty) {
        $.ajax({
            url: `${apiUrl}?amount=5&category=${category}&difficulty=${difficulty}&type=multiple`,
            method: 'GET',
            success: (response) => {
                if (response.results.length > 0) {
                    questions = response.results;
                    startQuiz();
                } else {
                    alert('No questions available for the selected options. Please try again.');
                }
            },
            error: () => {
                alert('Error fetching questions. Please try again later.');
            },
        });
    }

    // Start the quiz
    function startQuiz() {
        $('#quiz-setup').addClass('hidden');
        $('#quiz-container').removeClass('hidden');
        currentQuestionIndex = 0;
        score = 0;
        displayQuestion();
    }

    // Display question and answers
    function displayQuestion() {
        const question = questions[currentQuestionIndex];
        $('#question-container').html(`<h3>${question.question}</h3>`);

        const answers = [...question.incorrect_answers, question.correct_answer];
        const shuffledAnswers = answers.sort(() => Math.random() - 0.5);

        $('#answers-container').html('');
        shuffledAnswers.forEach((answer) => {
            $('#answers-container').append(
                `<button class="answer">${answer}</button>`
            );
        });

        $('.answer').click(function () {
            $('.answer').prop('disabled', true);
            if ($(this).text() === question.correct_answer) {
                $(this).addClass('correct');
                score++;
            } else {
                $(this).addClass('wrong');
                $(`.answer:contains("${question.correct_answer}")`).addClass('correct');
            }
            $('#next-question').removeClass('hidden');
        });
    }

    // Next Question Button
    $('#next-question').click(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
            $('#next-question').addClass('hidden');
        } else {
            endQuiz();
        }
    });

    // End Quiz
    function endQuiz() {
        $('#quiz-container').addClass('hidden');
        $('#quiz-results').removeClass('hidden');
        $('#score').text(`${score}/${questions.length}`);
    }

    // Restart Quiz Button
    $('#restart-quiz').click(() => {
        $('#quiz-results').addClass('hidden');
        $('#quiz-setup').removeClass('hidden');
    });
});