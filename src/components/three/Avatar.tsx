import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import type { GLTF } from "three-stdlib";
import AvatarAnimator, { type BindPose, type BoneMap } from "./AvatarAnimator";
import { TRACKED_BONES } from "@/animations/avatarPoses";

const AVATAR_URL = "/models/avatar.glb";

interface AvatarProps {
  reducedMotion: boolean;
  enableShadows: boolean;
}

export default function Avatar({ reducedMotion, enableShadows }: AvatarProps) {
  const gltf = useGLTF(AVATAR_URL) as unknown as GLTF;
  const groupRef = useRef<THREE.Group>(null);

  const clone = useMemo(() => SkeletonUtils.clone(gltf.scene) as THREE.Group, [gltf.scene]);

  const { bones, bind } = useMemo(() => {
    const boneMap: BoneMap = {};
    const bindMap: BindPose = {};

    TRACKED_BONES.forEach((name) => {
      const obj = clone.getObjectByName(name);
      if (obj && (obj as THREE.Bone).isBone) {
        const bone = obj as THREE.Bone;
        boneMap[name] = bone;
        bindMap[name] = {
          quat: bone.quaternion.clone(),
          pos: bone.position.clone(),
        };
      }
    });

    return { bones: boneMap, bind: bindMap };
  }, [clone]);

  useEffect(() => {
    clone.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = enableShadows;
        mesh.receiveShadow = enableShadows;
        const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
        const mats = Array.isArray(mat) ? mat : [mat];
        mats.forEach((m) => {
          if (m) m.envMapIntensity = 1.1;
        });
      }
    });
  }, [clone, enableShadows]);

  return (
    <>
      <group ref={groupRef} dispose={null}>
        <primitive object={clone} scale={1} />
      </group>
      <AvatarAnimator groupRef={groupRef} bones={bones} bind={bind} reducedMotion={reducedMotion} />
    </>
  );
}

useGLTF.preload(AVATAR_URL);
