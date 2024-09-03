import 'package:flutter/material.dart';
import 'math_shader.dart';

void main() {

  runApp( myApp());
}
class myApp extends StatelessWidget {
  const myApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: MathShaderWidget(),
    );
  }
}


//
// class MyApp extends StatelessWidget {
//   const MyApp({Key? key}) : super(key: key);
//
//   final String fShader = '''
// // https://www.shadertoy.com/view/XlfGRj
// // Star Nest by Pablo Roman Andrioli
//
// #define iterations 17
// #define formuparam 0.53
//
// #define volsteps 20
// #define stepsize 0.1
//
// #define zoom   0.800
// #define tile   0.850
// #define speed  0.010
//
// #define brightness 0.0015
// #define darkmatter 0.300
// #define distfading 0.730
// #define saturation 0.850
//
//
// void mainImage( out vec4 fragColor, in vec2 fragCoord )
// {
// 	//get coords and direction
// 	vec2 uv=fragCoord.xy/iResolution.xy-.5;
// 	uv.y*=iResolution.y/iResolution.x;
// 	vec3 dir=vec3(uv*zoom,1.);
// 	float time=iTime*speed+.25;
//
// 	//mouse rotation
// 	float a1=.5+iMouse.x/iResolution.x*2.;
// 	float a2=.8+iMouse.y/iResolution.y*2.;
// 	mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
// 	mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
// 	dir.xz*=rot1;
// 	dir.xy*=rot2;
// 	vec3 from=vec3(1.,.5,0.5);
// 	from+=vec3(time*2.,time,-2.);
// 	from.xz*=rot1;
// 	from.xy*=rot2;
//
// 	//volumetric rendering
// 	float s=0.1,fade=1.;
// 	vec3 v=vec3(0.);
// 	for (int r=0; r<volsteps; r++) {
// 		vec3 p=from+s*dir*.5;
// 		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
// 		float pa,a=pa=0.;
// 		for (int i=0; i<iterations; i++) {
// 			p=abs(p)/dot(p,p)-formuparam; // the magic formula
// 			a+=abs(length(p)-pa); // absolute sum of average change
// 			pa=length(p);
// 		}
// 		float dm=max(0.,darkmatter-a*a*.001); //dark matter
// 		a*=a*a; // add contrast
// 		if (r>6) fade*=1.-dm; // dark matter, don't render near
// 		//v+=vec3(dm,dm*.5,0.);
// 		v+=fade;
// 		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
// 		fade*=distfading; // distance fading
// 		s+=stepsize;
// 	}
// 	v=mix(vec3(length(v)),v,saturation); //color adjust
// 	fragColor = vec4(v*.01,1.);
// }
//   ''';
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Center(
//         child: SizedBox(
//           width: 400,
//           height: 300,
//           child: FutureBuilder(
//             /// The surface size identifies the real texture size and
//             /// it is not related to the above SizedBox size
//             future: OpenGLController().openglPlugin.createSurface(300, 200),
//             builder: (_, snapshot) {
//               if (snapshot.hasError || !snapshot.hasData) {
//                 return const SizedBox.shrink();
//               }
//               /// When the texture id is got, it will be possible
//               /// to start renderer, set a shader and display it
//
//               /// Start renderer thread
//               OpenGLController().openglFFI.startThread();
//
//               /// Set the fragment shader
//               OpenGLController().openglFFI.setShaderToy(fShader);
//
//               /// build the texture widget
//               return OpenGLTexture(id: snapshot.data!);
//             },
//           ),
//         ),
//       ),
//     );
//   }
// }