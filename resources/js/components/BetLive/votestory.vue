<template>
<v-card fluid wrap class="fill-height" id="main_content">
    <v-btn id="screenshot" @click="download_image()"><v-icon>{{icons.mdiCamera}}</v-icon></v-btn>
    <canvas ref="canvas" id="div_to_capture"
    width="278.4375px"
    height="495px"
    >
    </canvas>
    <canvas ref="canvas2" id="div_to_capture2"
    width="800px"
    height="600px"
    >
    </canvas>
</v-card>
</template>

<script>
import {
    mdiCamera,
  } from '@mdi/js'
import { mapGetters } from 'vuex'

export default{

data: () => ({
    icons: {
            mdiCamera
    },
    canvas: null,
    context: null,
}),

computed: {
    ...mapGetters({
        current_background: 'backgrounds/currentBackground',
        selected_matches: 'matches/selectedMatches',
        current_template: 'templates/currentTemplate',
        my_backgrounds: 'backgrounds/myBackgrounds',
        other_backgrounds: 'backgrounds/otherBackgrounds',
    }),
},

methods: {
        download_image(){
            var img = document.createElement('a');
            img.href = this.$refs.canvas2.toDataURL("image/png");
            img.download = 'myfile.png';
            img.click(); 
        },
},

mounted(){
    //canvas to show
    this.canvas=this.$refs.canvas;
    this.context=this.canvas.getContext('2d');
    var ctx=this.context;
    var background_image = new Image();
    let canvas_width=this.canvas.width;
    let canvas_height=this.canvas.height;
    background_image.src = 'storage/backgrounds/'+this.current_background.name;
    background_image.onload = function(){
        let scale = Math.max(canvas_width / this.width, canvas_height / this.height);
        let x = (canvas_width / 2) - (this.width / 2) * scale;
        let y = (canvas_height / 2) - (this.height / 2) * scale;
        ctx.drawImage(background_image, x, y, this.width * scale, this.height * scale);
    }

    //canvas to download
    this.canvas2=this.$refs.canvas2;
    this.context2=this.canvas2.getContext('2d');
    var ctx2=this.context2;
    var background_image2 = new Image();
    let canvas_width2=this.canvas2.width;
    let canvas_height2=this.canvas2.height;
    background_image2.src = 'storage/backgrounds/'+this.current_background.name;
    background_image2.onload = function(){
        let scale = Math.max(canvas_width2 / this.width, canvas_height2 / this.height);
        let x = (canvas_width2 / 2) - (this.width / 2) * scale;
        let y = (canvas_height2 / 2) - (this.height / 2) * scale;
        ctx2.drawImage(background_image2, x, y, this.width * scale, this.height * scale);
    }
},

created(){
    if(this.current_background==null){
        this.my_backgrounds.forEach(background => {
            if(background.id==this.current_template.background_id){
                background.url=this.current_template.id;
                return this.$store.dispatch('backgrounds/currentBackground', background);
            }
        });
        this.other_backgrounds.forEach(background => {
            if(background.id==this.current_template.background_id){
                background.url=this.current_template.id;
                return this.$store.dispatch('backgrounds/currentBackground', background);
            }
        });
    }
}
};
</script>
