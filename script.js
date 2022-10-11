$(document).ready(function() {
    $('button#start-btn').click(() => $('#main').show() );

    $('input[name="previousCourse"]').change(checkPrevCourse);
    $('input[name="previousExp"]').change(checkPrevExp);
    $('select[name="lastCourse"]').change(checkLastCouse);
    $('input[name="142Score"]').change(check142Grade);
    $('input[name="apScore"]').change(checkAPGrade);
    $('input[name="ibScore"]').change(checkIBGrade);
    $('#topics-121').find('select').change(check121Topics);
    $('#topics-122').find('select').change(check122Topics);
    $('input[name^="p_121p"]').change(check121Problem);
    $('input[name^="p_122p"]').change(check122Problem);
});

function checkPrevCourse(event) {
    let resp = $('input[name="previousCourse"]:checked').val();
    console.log(resp);
    if (resp == 'Yes') {
        showQuestion(event, $(event.target), $('#lastCourse'));
    } else {
        showNextQuestion(event, $(event.target));
    }
}

function checkPrevExp(event) {
    let resp = $('input[name="previousExp"]:checked').val();
    console.log(resp);
    if (resp == 'No') {
        showQuestion(event, $(event.target), $('#result-121-noexp'));
    } else {
        showQuestion(event, $(event.target), $('#topics-121'));
    }
}

function checkLastCouse(event) {
    $('.gradeCheck').prop("checked", false);
    $('.gradeCheck').hide();

    let course = $('select[name="lastCourse"]').val();
    console.log(course);
    switch(course) {
        case 'CSE142':
            showQuestion(event, $(event.target), $('#142Score'));
            break;
        case 'AP-A':
            showQuestion(event, $(event.target), $('#apScore'));
            break;
        case 'IB-SL':
        case 'IB-HL':
            showQuestion(event, $(event.target), $('#ibScore'));
            break;
        // case 'ECS':
        // case 'AP-P':
        //     showQuestion(event, $(event.target), $('#result-adv'))
        //     break;
        default:
            showQuestion(event, $(event.target), $('#topics-121'));
            break;
    }
}

function check142Grade(event) {
    $('input[name="apScore"]').prop("checked", false);
    $('input[name="ibScore"]').prop("checked", false);

    let grade = $('input[name="142Score"]:checked').val();
    console.log(grade);
    switch (grade) {
        case '2':
        case '3':
        case 'S':
        case 'X':
            showQuestion(event, $(event.target), $('#topics-121'));
            break;
        default:
            showQuestion(event, $(event.target), $('#result-adv'));
            break;
    }
}

function checkAPGrade(event) {
    $('input[name="142Score"]').prop("checked", false);
    $('input[name="ibScore"]').prop("checked", false);

    let grade = $('input[name="apScore"]:checked').val();
    console.log(grade);
    switch (grade) {
        case '3':
        case '4':
        case '5':
        case 'X':
            showQuestion(event, $(event.target), $('#topics-121'));
            break;
        default:
            showQuestion(event, $(event.target), $('#result-adv'));
            break;
    }
}

function checkIBGrade(event) {
    $('input[name="apScore"]').prop("checked", false);
    $('input[name="142Score"]').prop("checked", false);

    let grade = $('input[name="ibScore"]:checked').val();
    console.log(grade);
    switch (grade) {
        case '4':
        case '5':
        case '6':
        case '7':
        case 'X':
            showQuestion(event, $(event.target), $('#topics-121'));
            break;
        default:
            showQuestion(event, $(event.target), $('#result-adv'));
            break;
    }
}

function check121Topics(event) {
    let topics = $('#topics-121').find('select');
    console.log(topics);

    let responses = topics.get().map(x => $(x).val());
    if (responses.every(x => x >= 3)) {
        showNextQuestion(event, $(event.target));
    } else if (responses.every(x => x)) {
        showQuestion(event, $(event.target), $('#result-121-topics'));
    } else {
        showQuestion(event, $(event.target), null);
    }
}

function check122Topics(event) {
    let topics = $('#topics-122').find('select');
    console.log(topics);

    let responses = topics.get().map(x => $(x).val());
    if (responses.every(x => x >= 3)) {
        showNextQuestion(event, $(event.target));
        // showQuestion(event, $(event.target), $("#result-123"))
    } else if (responses.every(x => x)) {
        if ($('select[name="lastCourse"]').val() == 'CSE142') {
            showQuestion(event, $(event.target), $('#result-122-from-142'));
        } else {
            showQuestion(event, $(event.target), $('#result-122'));
        }
    } else {
        showQuestion(event, $(event.target), null);
    }
}

function check121Problem(event) {
    let resp = $(event.target).filter(':checked').val();
    console.log(resp);

    if (resp <= 2) {
        showQuestion(event, $(event.target), $('#result-121-topics'));
    } else if (resp == 3) {
        showQuestion(event, $(event.target), $('#result-adv'));
    } else {
        showNextQuestion(event, $(event.target));
    }
}

function check122Problem(event) {
    let resp = $(event.target).filter(':checked').val();
    console.log(resp);

    if (resp <= 2) {
        if ($('select[name="lastCourse"]').val() == 'CSE142') {
            showQuestion(event, $(event.target), $('#result-122-from-142'));
        } else {
            showQuestion(event, $(event.target), $('#result-122'));
        }
    } else if (resp == 3) {
        showQuestion(event, $(event.target), $('#result-adv'));
    } else if ($(event.target).attr('id').startsWith('p_122p3')) {
        if ($('select[name="lastCourse"]').val() == 'CSE142') {
            showQuestion(event, $(event.target), $('#result-123-from-142'));
        } else {
            showQuestion(event, $(event.target), $('#result-123'));
        }
    } else {
        showNextQuestion(event, $(event.target));
    }
}

function showQuestion(event, prev, target) {
    // hide all later questions
    prev.parents('.question').nextAll('.question').hide();

    // hide results
    $('.result').hide();

    if (target) {
        target.show();
        target.children().show();

        //// Smoothly scroll to this element that was just revealed
        $("html, body").animate({ scrollTop: $(document).height()}, "fast", "linear");

        if (target.hasClass('result')) {
            $('#result-hidden').text(target.attr('id'));
            saveData(event)
        }
    }
}

function showNextQuestion(event, prev) {
    showQuestion(event, prev, prev.parents('.question').next('.question'));
}


function saveData(e) {
    const action = "https://script.google.com/macros/s/AKfycbxRVJ8KIzKBiNzI71b1L3cVv0idoR8lpec0Zpkk-mJJvTw18Nr_rlcB31Hc-2nk07Zyqg/exec"

    e.preventDefault();
    const data = new FormData($('#main').get()[0]);
    fetch(action, {method: 'POST', body: data,})
}