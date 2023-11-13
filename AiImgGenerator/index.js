const generatorForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".img-gallery");

const OPENAI_API_KEY = "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";

const updateImageCard = (imgDataArray) =>{
    imgDataArray.forEach((imgObject, index)=>{
        const imgCard = imageGallery.querySelectorAll("img-card")[index];
        const imgElement = imgCard.querySelectorAll("img");

        const AiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = AiGeneratedImg;

        imgCardElement.onload = ()=>{
            imgCard.classList.remove("loading");
        }
    });
}

const genrateAiImages = async(userPromt, userImgQuantity) =>{
    try{
        const response = await fetch("https://api.openai.com/v1/images/generations",{
            method: "POST",
            header:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                 prompt: userPromt,
                 n: parseInt(userImgQuantity),
                 size: "512x512",
                 response_format: "b64_json"
            })
        });
        if(!response.ok) throw new Error("Failed to generate images! Please try again.")
       
        const{data} = await response.json(); 
        updateImageCard([...data]);
 
    }catch (error){
        console.log(error);
    }
}

const handleFormSubmission =(e) =>{
    e.preventDefault();
    
    const userPrompt = e.target[0].value;
    const userImgQuantity = e.target[1].value;

     const imgCardMarkup = Array.from({length: userImgQuantity}, ()=>
     ` <div class="img-card loading " >
     <img src="/AiImgGenerator/loader.svg" alt="" srcset="">
     <a href="#" class="download-btn">
         <img src="/AiImgGenerator/download.svg" alt="download icon" srcset="">
     </a>
 </div>`
     ).join("");

     imageGallery.innerHTML = imgCardMarkup; 
     genrateAiImages(userPrompt, userImgQuantity);

}

generatorForm.addEventListener("submit", handleFormSubmission);
