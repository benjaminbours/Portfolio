	<script type="text/javascript" src="https://code.jquery.com/jquery-2.2.4.min.js"></script>

	<script type="x-shader/x-vertex" id="tessellateVertexshader">

		uniform float amplitude;
		uniform float rotate;
        uniform float time;
        uniform float opacity;

		attribute vec3 translateDirection;
		attribute vec3 origin;
		attribute float angle;
		attribute float delay;
		attribute vec3 axisRotation;

		varying vec3 vNormal;
        varying vec2 myUv;
        vec3 vPosition;

        mat4 rotationMatrix(vec3 axis, float angle)
        {
            axis = normalize(axis);
            float s = sin(angle);
            float c = cos(angle);
            float oc = 1.0 - c;

            return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                        oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                        oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                        0.0,                                0.0,                                0.0,                                1.0);
        }

		void main() {

            float updateTime;

            if ( time <= delay) {
                updateTime = 0.0;
            } else {
                // updateTime = (time-delay)*(10.0-time);
                updateTime = (time-delay);
            }

            vec3 newPosition;
            vec3 newOrigin;

            vPosition = position;
            // this is the setup of the rotation matrix
            float powerRotation = 1.0;
            float angleRotation = angle * powerRotation * updateTime;
            mat4 rotation = rotationMatrix(axisRotation, angleRotation);

			vNormal = normal;
            myUv = uv;

            // this position the texture in the good direction
            float uvX = (myUv.x * -1.0) + 1.0;
            float uvY = myUv.y;
            myUv = vec2(uvX, uvY);

            // TODO: Terminer le parametrage de la force de translation
            // float powerTranslation = 5.0;
            // powerTranslation -= time;
            //
            // if (powerTranslation <= 0.0) {
            //
            //     powerTranslation = 0.0;
            //     powerTranslation += time - 5.0;
            //
            // }

            // quand

            // this is the application of the translation to vertex position
            newPosition = vPosition + updateTime  * translateDirection;
            newOrigin = origin + updateTime  * translateDirection;

            // this is the application of the rotation matrix setup before
            // we need to substract from vertex position, the distance from origin of each face.
            // then multiplie by the rotation
            // and finaly add back the distance from origin to the result
            vec4 lastPosition = (vec4(newPosition, 1.0) - vec4(newOrigin, 1.0)) * rotation;
            lastPosition = lastPosition + vec4(newOrigin, 1.0);

        	gl_Position = projectionMatrix * modelViewMatrix * lastPosition;

		}

	</script>

	<script type="x-shader/x-fragment" id="tessellateFragmentshader">

		varying vec3 vNormal;
        uniform sampler2D texture;
        varying vec2 myUv;
        uniform float opacity;

		void main() {

			vec3 light = vec3( 1.0,0.5,0.0 );
			light = normalize( light );

			float directional = max( dot( vNormal, light ), 1.0 );
			gl_FragColor = texture2D (texture, myUv);
            gl_FragColor.a = opacity;
			// gl_FragColor = vec4(1.0,1.0,1.0,opacity);

		}

	</script>

	<script type="text/javascript" src="js/scripts.js"></script>
</body>
</html>
