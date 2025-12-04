import { useRef, useEffect, useState, useCallback } from 'react';
import { canvasPath, wigglePreset } from 'blobs/v2/animate';
import { BLOB_CONFIG, ANIMATION_CONFIG } from '../constants/hero';

/**
 * Custom hook for managing blob animation
 * @returns {Object} Animation state and refs
 */
export function useBlobAnimation() {
  const [blobReady, setBlobReady] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const frameRef = useRef(null);
  const renderFrameRef = useRef(null);
  const isVisibleRef = useRef(true);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size - responsive for desktop
    const width = Math.min(BLOB_CONFIG.MAX_WIDTH, window.innerWidth);
    const height = Math.min(BLOB_CONFIG.MAX_HEIGHT, window.innerHeight * 0.8);
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, BLOB_CONFIG.DEVICE_PIXEL_RATIO_CAP);

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(devicePixelRatio, devicePixelRatio);

    return { ctx, width, height };
  }, []);

  const loadPatternImage = useCallback((ctx, width, height) => {
    return new Promise((resolve) => {
      const patternImage = new Image();
      patternImage.crossOrigin = 'anonymous';

      patternImage.onload = () => {
        try {
          const fillPattern = ctx.createPattern(patternImage, 'no-repeat');
          if (fillPattern && fillPattern.setTransform) {
            const scaleX = width / patternImage.width;
            const scaleY = height / patternImage.height;
            const matrix = new DOMMatrix();
            matrix.scaleSelf(scaleX, scaleY);
            fillPattern.setTransform(matrix);
          }
          resolve(fillPattern);
        } catch (e) {
          console.warn('Pattern transform not supported, using fallback');
          resolve(null);
        }
      };

      patternImage.onerror = () => {
        console.warn('Failed to load blob image pattern');
        resolve(null);
      };

      patternImage.src = BLOB_CONFIG.IMAGE_PATH;
    });
  }, []);

  const createAnimation = useCallback((width, height) => {
    const animation = canvasPath();
    animationRef.current = animation;

    const baseSize = Math.min(width, height);

    wigglePreset(
      animation,
      {
        extraPoints: ANIMATION_CONFIG.EXTRA_POINTS,
        randomness: ANIMATION_CONFIG.RANDOMNESS,
        seed: ANIMATION_CONFIG.SEED_MULTIPLIER,
        size: baseSize,
      },
      {
        offsetX: (width - baseSize) / 2,
        offsetY: (height - baseSize) / 2,
      },
      {
        speed: ANIMATION_CONFIG.SPEED,
        initialTransition: ANIMATION_CONFIG.INITIAL_TRANSITION,
      }
    );

    return animation;
  }, []);

  const startAnimation = useCallback(async () => {
    const canvasSetup = setupCanvas();
    if (!canvasSetup) return;

    const { ctx, width, height } = canvasSetup;
    const fillPattern = await loadPatternImage(ctx, width, height);
    const animation = createAnimation(width, height);

    const renderFrame = () => {
      if (!isVisibleRef.current) {
        frameRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (fillPattern) {
        ctx.fillStyle = fillPattern;
      } else {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ec576b');
        gradient.addColorStop(1, '#ff6b7a');
        ctx.fillStyle = gradient;
      }

      ctx.fill(animation.renderFrame());
      frameRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrameRef.current = renderFrame;
    frameRef.current = requestAnimationFrame(renderFrame);
    setBlobReady(true);
  }, [setupCanvas, loadPatternImage, createAnimation]);

  const pauseAnimation = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const resumeAnimation = useCallback(() => {
    if (renderFrameRef.current && !frameRef.current) {
      frameRef.current = requestAnimationFrame(renderFrameRef.current);
    }
  }, []);

  // Setup intersection observer for visibility
  useEffect(() => {
    const heroWrapper = document.querySelector('[class*="heroWrapper"]');
    if (!heroWrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        isVisibleRef.current = isVisible;

        if (!isVisible) {
          pauseAnimation();
        } else {
          resumeAnimation();
        }
      },
      { threshold: BLOB_CONFIG.INTERSECTION_THRESHOLD }
    );

    observer.observe(heroWrapper);
    return () => observer.disconnect();
  }, [pauseAnimation, resumeAnimation]);

  // Initialize animation on desktop
  useEffect(() => {
    const isMobile = window.innerWidth < BLOB_CONFIG.MOBILE_BREAKPOINT;
    if (isMobile) return;

    startAnimation();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [startAnimation]);

  return {
    canvasRef,
    blobReady,
    isVisible: isVisibleRef.current,
  };
}
