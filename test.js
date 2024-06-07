const assert = require('assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const fetch = require('node-fetch');
global.fetch = fetch;

//홈페이지.ejs
describe('HomePage', () => {
    let window, document;

    before((done) => {
        const html = fs.readFileSync(path.resolve(__dirname, 'views', 'homePage.ejs'), 'utf8');
        const dom = new JSDOM(html, {
            runScripts: "dangerously",
            resources: "usable"
        });
        window = dom.window;
        document = window.document;

        dom.window.onload = () => {
            done();
        };
    });

    it('should have canvas element', () => {
        const canvas = document.querySelector('.webgl');
        assert.ok(canvas, "Canvas element does not exist");
    });

    it('should have buttons for daily record, setting, and calendar', () => {
        const dailyRecordButton = document.querySelector('.daily-record');
        const settingButton = document.querySelector('.setting');
        const calendarButton = document.querySelector('.calendar');

        assert.ok(dailyRecordButton, "Daily record button does not exist");
        assert.ok(settingButton, "Setting button does not exist");
        assert.ok(calendarButton, "Calendar button does not exist");
    });

    it('should have button for adding family member', () => {
        const addButton = document.querySelector('.addUser');
        assert.ok(addButton, "Add user button does not exist");
    });

    it('should have valid import map for three.js', () => {
        const importMap = document.querySelector('script[type="importmap"]');
        assert.ok(importMap, "Import map for three.js does not exist");

        const importMapContent = JSON.parse(importMap.textContent);
        assert.strictEqual(importMapContent.imports.three, "./build/three.module.js", "Import map for three.js is incorrect");
    });

    it('should have valid stylesheet link', () => {
        const stylesheetLink = document.querySelector('link[rel="stylesheet"]');
        assert.ok(stylesheetLink, "Stylesheet link does not exist");
        assert.strictEqual(stylesheetLink.getAttribute('href'), "main.css", "Stylesheet link is incorrect");
    });

    it('should import gsap library', () => {
        const gsapScript = document.querySelector('script[src^="https://cdnjs.cloudflare.com/ajax/libs/gsap"]');
        assert.ok(gsapScript, "GSAP library script does not exist");
    });

    it('should have script for mainPage2.js and ottogi2.js', () => {
        const mainPageScript = document.querySelector('script[src="./mainPage2.js"]');
        const ottogiScript = document.querySelector('script[src="./ottogi2.js"]');

        assert.ok(mainPageScript, "mainPage2.js script does not exist");
        assert.ok(ottogiScript, "ottogi2.js script does not exist");
    });

    it('should have form elements for navigation', () => {
        const dailyRecordForm = document.querySelector('form[action="/daily-record"]');
        const settingForm = document.querySelector('form[action="/setting"]');
        const calendarForm = document.querySelector('form[action="/calendar"]');
        const addUserForm = document.querySelector('form[action="/addUser"]');

        assert.ok(dailyRecordForm, "Form for daily record navigation does not exist");
        assert.ok(settingForm, "Form for setting navigation does not exist");
        assert.ok(calendarForm, "Form for calendar navigation does not exist");
        assert.ok(addUserForm, "Form for adding family member navigation does not exist");
    });
});


//세팅.html
describe('Setting Page', () => {
    let window, document;

    before((done) => {
        const html = fs.readFileSync(path.resolve(__dirname, 'setting.html'), 'utf8');
        const dom = new JSDOM(html, {
            runScripts: "dangerously", // 위험할 수 있으므로 실제 실행 환경에서는 주의해야 합니다.
            resources: "usable"
        });
        window = dom.window;
        document = window.document;

        // window.onload가 발생할 때까지 대기
        dom.window.onload = () => {
            done();
        };
    });

    it('should have gender radio buttons', () => {
        const maleRadioButton = document.getElementById('male');
        const femaleRadioButton = document.getElementById('female');
        
        assert.ok(maleRadioButton, "Male radio button does not exist");
        assert.ok(femaleRadioButton, "Female radio button does not exist");
    });

    it('should have age input field', () => {
        const ageInput = document.getElementById('age');
        assert.ok(ageInput, "Age input field does not exist");
    });

    it('should have height input field', () => {
        const heightInput = document.getElementById('height');
        assert.ok(heightInput, "Height input field does not exist");
    });

    it('should have weight input field', () => {
        const weightInput = document.getElementById('weight');
        assert.ok(weightInput, "Weight input field does not exist");
    });

    it('should have sleeptime input field', () => {
        const sleeptimeInput = document.getElementById('sleeptime');
        assert.ok(sleeptimeInput, "Sleeptime input field does not exist");
    });

    it('should have activity radio buttons', () => {
        const sedentaryRadioButton = document.getElementById('sedentary');
        const lightlyActiveRadioButton = document.getElementById('lightly_active');
        const activeRadioButton = document.getElementById('active');
        const veryActiveRadioButton = document.getElementById('very_active');
        
        assert.ok(sedentaryRadioButton, "Sedentary radio button does not exist");
        assert.ok(lightlyActiveRadioButton, "Lightly Active radio button does not exist");
        assert.ok(activeRadioButton, "Active radio button does not exist");
        assert.ok(veryActiveRadioButton, "Very Active radio button does not exist");
    });

    describe('BMI Calculation', () => {
        it('should calculate BMI when submitting the form', () => {
            const heightInput = document.getElementById('height');
            const weightInput = document.getElementById('weight');
            const bmiInput = document.getElementById('bmi');
        
            heightInput.value = '175';
            weightInput.value = '70';
        
            // calculateBMI 함수 호출
            window.calculateBMI();
        
            // BMI 계산 결과 확인
            assert.strictEqual(bmiInput.value, '22.86', "BMI calculation is incorrect");
        });
    });
});


//로그인페이지
describe('LoginPage', () => {
  let window, document;

  before((done) => {
      const html = fs.readFileSync(path.resolve(__dirname, 'views/login.ejs'), 'utf8'); // 수정된 부분
      const dom = new JSDOM(html, {
          runScripts: "dangerously",
          resources: "usable"
      });
      window = dom.window;
      document = window.document;

      dom.window.onload = () => {
          done();
      };
  });

  it('should have form elements for login', () => {
      const form = document.querySelector('.form-box');
      assert.ok(form, "Form element does not exist");
      
      const usernameInput = document.querySelector('input[name="username"]');
      const passwordInput = document.querySelector('input[name="password"]');
      const loginButton = document.querySelector('button[type="submit"]');
      const registerLink = document.querySelector('a[href="/register"]');

      assert.ok(usernameInput, "Username input field does not exist");
      assert.ok(passwordInput, "Password input field does not exist");
      assert.ok(loginButton, "Login button does not exist");
      assert.ok(registerLink, "Register link does not exist");
  });
});


//addFamily.ejs
describe('AddFamilyPage', () => {
  let window, document;

  before((done) => {
      const html = fs.readFileSync(path.resolve(__dirname, 'views/addFamily.ejs'), 'utf8');
      const dom = new JSDOM(html, {
          runScripts: "dangerously",
          resources: "usable"
      });
      window = dom.window;
      document = window.document;

      dom.window.onload = () => {
          done();
      };
  });

  it('should have input fields and checkbox', () => {
      const memberInput = document.querySelector('input[name="Member"]');
      const notFamilyCheckbox = document.querySelector('input[name="NotFamily"]');
      const submitButton = document.querySelector('button[type="submit"]');

      assert.ok(memberInput, "Member input field does not exist");
      assert.ok(notFamilyCheckbox, "NotFamily checkbox does not exist");
      assert.ok(submitButton, "Submit button does not exist");
  });

  it('should disable notFamily checkbox if member input has value', () => {
      const memberInput = document.querySelector('input[name="Member"]');
      const notFamilyCheckbox = document.querySelector('input[name="NotFamily"]');
      
      memberInput.value = 'Example Family';

      // Create and dispatch 'input' event
      const event = document.createEvent('Event');
      event.initEvent('input', true, true);
      memberInput.dispatchEvent(event);

      assert.strictEqual(notFamilyCheckbox.disabled, true, "NotFamily checkbox should be disabled");
  });

  it('should enable member input if notFamily checkbox is unchecked', () => {
      const memberInput = document.querySelector('input[name="Member"]');
      const notFamilyCheckbox = document.querySelector('input[name="NotFamily"]');
      
      notFamilyCheckbox.checked = false;

      // Create and dispatch 'input' event
      const event = document.createEvent('Event');
      event.initEvent('input', true, true);
      notFamilyCheckbox.dispatchEvent(event);

      assert.strictEqual(memberInput.disabled, false, "Member input should be enabled");
  });
});


//adduser.ejs
describe('AddUserPage', () => {
    let window, document;

    before((done) => {
        const html = fs.readFileSync(path.resolve(__dirname, 'views/addUser.ejs'), 'utf8');
        const dom = new JSDOM(html, {
            runScripts: "dangerously",
            resources: "usable"
        });
        window = dom.window;
        document = window.document;

        dom.window.onload = () => {
            done();
        };
    });

    it('should have input fields and button', () => {
        const memberInput = document.querySelector('input[name="Member"]');
        const newMemberInput = document.querySelector('input[name="NewMember"]');
        const submitButton = document.querySelector('button[type="submit"]');

        assert.ok(memberInput, "Member input field does not exist");
        assert.ok(newMemberInput, "New member input field does not exist");
        assert.ok(submitButton, "Submit button does not exist");
    });
});


//달력


//데일리레코드.ejs
describe('DailyRecordPage', () => {
    let window, document;

    before((done) => {
        const html = fs.readFileSync(path.resolve(__dirname, 'views/daily-record.ejs'), 'utf8');
        const dom = new JSDOM(html, {
            runScripts: "dangerously",
            resources: "usable"
        });
        window = dom.window;
        document = window.document;

        dom.window.onload = () => {
            done();
        };
    });

    it('should display message on page load', () => {
        const messageDiv = document.getElementById('message');
        const message = "헬뚝이는 매일 기록 페이지에서 식단, 운동, 수면 시간을 최소 1회 기록하면 생성됩니다!";
        assert.strictEqual(messageDiv.innerText.trim(), message);
    });

    it('should redirect to home page when redirect button is clicked', () => {
        const redirectButton = document.getElementById('redirectButton');
        const clickEvent = new window.MouseEvent('click');
        redirectButton.dispatchEvent(clickEvent);
        assert.strictEqual(window.location.href, '/homePage');
    });

    it('should delete exercise item when delete button is clicked', () => {
        const deleteButton = document.querySelector('.deleteButton.exercise');
        const clickEvent = new window.MouseEvent('click');
        deleteButton.dispatchEvent(clickEvent);
        // You may need to check if the fetch request is sent correctly and handle the response accordingly
    });

    it('should delete meal item when delete button is clicked', () => {
        const deleteButton = document.querySelector('.deleteButton.breakfast');
        const clickEvent = new window.MouseEvent('click');
        deleteButton.dispatchEvent(clickEvent);
        // You may need to check if the fetch request is sent correctly and handle the response accordingly
    });

});


//회원가입.ejs
const jQuery = require('jquery')(new JSDOM().window);
global.$ = jQuery;

describe('register', () => {
  describe('#checkNickname()', () => {
    it('should show nickname error message if nickname exists', () => {
      // 가상의 데이터 설정
      const data = { exists: true };
    
      // jQuery ajax를 sinon으로 stubbing
      sinon.stub($, 'get').yields(data);
    
      // 테스트할 함수 호출
      $('#userNickname').val('existingNickname');
      $('#userNickname').trigger('input');
    
      // 확인
      // jQuery 대신에 순수한 JavaScript로 요소의 가시성 확인
      assert(document.getElementById('nicknameError').style.display !== 'none');
      assert($('#submitBtn').prop('disabled'));
    
      // stub 복원
      $.get.restore();
    });
    

    it('should hide nickname error message if nickname does not exist', () => {
      // jQuery ajax를 가상으로 대체하여 stubbing
      const ajaxStub = (options) => {
        const data = { exists: false };
        options.success(data);
      };

      // $.get 함수를 가상의 ajaxStub으로 대체
      $.get = ajaxStub;

      // 테스트할 함수 호출
      $('#userNickname').val('uniqueNickname');
      $('#userNickname').trigger('input');

      // 확인
      assert(!$('#nicknameError').is(':visible')); // 변경된 부분
      assert(!$('#submitBtn').prop('disabled'));

      // $.get 함수를 원래대로 복원
      delete $.get;
    });
  });
});