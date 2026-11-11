function setupOTPInputs(){
     // Move forward on valid digit entry
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value.replace(/\D/g, '')
            e.target.value = value
            if(input && index < inputs.length -1){
                inputs[index +1].focus()
            }
        })
    })
    
    input.addEventListener('keydown', (e) => {
        if(e.key === 'Backspace' && !e.target.value && index > 0){
            inputs[index -1].focus()
        }
    })

    input.addEventListener('paste', (e) => {
        e.preventDefault()
    const pasted = (e.clipboardData || window.clipboardData)
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, inputs.length);
    })

    pasted.split('').foreach((char, i) => {
        if(input[i]) inputs[i].value = char
    })

    const nextfocus = Math.min(pasted.length, inputs.length -1)
    inputs[nextfocus].focus()
    }

    export default setupOTPInputs;
   