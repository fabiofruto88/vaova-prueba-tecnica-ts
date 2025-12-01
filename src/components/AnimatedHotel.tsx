import { motion, type Variants, useAnimation } from "framer-motion";
import { useEffect } from "react";

const AnimatedHotel = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const buildingPartVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        // narrow the "type" to a literal to satisfy the Transition type;
        // if your tsconfig still complains, the `as any` cast below silences the type mismatch safely.
        type: "spring",
        damping: 12,
        stiffness: 100,
      } as any,
    },
  };

  const controls = useAnimation();

  useEffect(() => {
    let mounted = true;
    const seq = async () => {
      while (mounted) {
        await controls.start("visible");
        await new Promise((r) => setTimeout(r, 2200));
        await controls.start("hidden");
        await new Promise((r) => setTimeout(r, 600));
      }
    };
    seq();
    return () => {
      mounted = false;
    };
  }, [controls]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "400px",
      }}
    >
      <motion.svg
        width="300px"
        height="300px"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Base del edificio - Primer piso */}
        <motion.g variants={buildingPartVariants}>
          <polygon
            fill="#E0E0E2"
            points="88.371,287.219 88.371,412.097 261.407,512 423.629,418.342 423.629,293.464 250.593,193.561"
          />
          <polygon
            fill="#C6C5CB"
            points="110.001,99.903 110.001,287.219 261.407,374.635 261.407,187.317"
          />
          <polygon
            fill="#ACABB1"
            points="391.185,112.39 391.185,299.707 261.407,374.635 261.407,187.317"
          />
        </motion.g>

        {/* Ventanas azules - Izquierda */}
        <motion.g variants={buildingPartVariants}>
          <polygon
            fill="#59A4FF"
            points="131.63,187.317 131.63,137.365 153.259,149.854 153.259,199.805"
          />
          <polygon
            fill="#59A4FF"
            points="174.89,212.293 174.89,162.342 196.519,174.829 196.519,224.781"
          />
          <polygon
            fill="#59A4FF"
            points="218.149,237.268 218.149,187.317 239.778,199.805 239.778,249.756"
          />
          <polygon
            fill="#59A4FF"
            points="131.63,274.57 131.63,224.619 153.259,237.107 153.259,287.057"
          />
          <polygon
            fill="#59A4FF"
            points="174.89,299.546 174.89,249.595 196.519,262.082 196.519,312.034"
          />
          <polygon
            fill="#59A4FF"
            points="218.149,324.634 218.149,274.683 239.778,287.17 239.778,337.122"
          />
        </motion.g>

        {/* Ventanas azules - Derecha */}
        <motion.g variants={buildingPartVariants}>
          <polygon
            fill="#2487FF"
            points="304.666,237.268 304.666,187.317 283.037,199.805 283.037,249.756"
          />
          <polygon
            fill="#2487FF"
            points="337.11,218.536 337.11,168.585 315.481,181.073 315.481,231.025"
          />
          <polygon
            fill="#2487FF"
            points="304.666,324.683 304.666,274.732 283.037,287.219 283.037,337.171"
          />
          <polygon
            fill="#2487FF"
            points="337.11,305.951 337.11,256 315.481,268.488 315.481,318.439"
          />
          <polygon
            fill="#2487FF"
            points="369.555,199.805 369.555,149.854 347.925,162.342 347.925,212.293"
          />
          <polygon
            fill="#2487FF"
            points="369.555,287.219 369.555,237.268 347.925,249.756 347.925,299.707"
          />
        </motion.g>

        {/* Techo morado */}
        <motion.g variants={buildingPartVariants}>
          <polygon
            fill="#6FA8E3"
            points="99.186,81.171 239.778,0 401.999,93.658 261.407,174.829"
          />
          <polygon
            fill="#3E8ADB"
            points="99.186,81.171 99.186,93.658 261.407,187.317 261.407,174.829"
          />
          <polygon
            fill="#0E4D97"
            points="261.407,187.317 401.999,106.146 401.999,93.658 261.407,174.829"
          />
          <polygon
            fill="#082F57"
            points="120.815,81.171 239.778,12.488 380.37,93.658 261.407,162.342"
          />
        </motion.g>

        {/* Detalles del techo - Esferas */}
        <motion.g
          variants={buildingPartVariants}
          animate={{
            y: [0, -5, 0],
            transition: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            },
          }}
        >
          <path
            fill="#C6C5CB"
            d="M286.046,115.834v-8.01l0,0c0.004-2.649-1.736-5.299-5.218-7.31c-6.963-4.021-18.358-4.021-25.321,0c-3.483,2.01-5.226,4.66-5.227,7.31l0,0v8.01l0,0c-0.004,2.649,1.732,5.299,5.212,7.307c6.956,4.016,18.349,4.016,25.321,0C284.301,121.133,286.045,118.484,286.046,115.834L286.046,115.834z"
          />
          <path
            fill="#E0E0E2"
            d="M255.507,100.515c-6.963,4.021-6.969,10.595-0.015,14.611c6.956,4.016,18.349,4.016,25.321,0c6.972-4.016,6.978-10.59,0.015-14.611S262.47,96.494,255.507,100.515z"
          />
          <path
            fill="#C6C5CB"
            d="M323.956,93.947v-8.01l0,0c0.004-2.649-1.736-5.299-5.218-7.31c-6.963-4.021-18.358-4.021-25.321,0c-3.483,2.01-5.226,4.66-5.227,7.31l0,0v8.01l0,0c-0.004,2.649,1.732,5.299,5.212,7.307c6.955,4.016,18.349,4.016,25.321,0C322.21,99.245,323.955,96.597,323.956,93.947L323.956,93.947z"
          />
          <path
            fill="#E0E0E2"
            d="M293.417,78.628c-6.963,4.02-6.969,10.595-0.015,14.611c6.955,4.016,18.349,4.016,25.321,0c6.972-4.016,6.978-10.591,0.015-14.611C311.775,74.607,300.38,74.607,293.417,78.628z"
          />
        </motion.g>

        {/* Ventanas inferiores */}
        <motion.g variants={buildingPartVariants}>
          <polygon
            fill="#ACABB1"
            points="261.407,512 423.629,418.342 423.629,293.464 261.407,387.122"
          />
          <polygon
            fill="#2487FF"
            points="304.666,449.561 304.666,399.61 283.037,412.097 283.037,462.049"
          />
          <polygon
            fill="#2487FF"
            points="337.11,430.829 337.11,380.878 315.481,393.365 315.481,443.317"
          />
          <polygon
            fill="#2487FF"
            points="369.555,412.097 369.555,362.146 347.925,374.635 347.925,424.585"
          />
          <polygon
            fill="#2487FF"
            points="401.999,393.365 401.999,343.415 380.37,355.903 380.37,405.854"
          />
        </motion.g>

        {/* Parte izquierda inferior */}
        <motion.g variants={buildingPartVariants}>
          <polygon
            fill="#C6C5CB"
            points="88.371,287.219 88.371,412.097 261.407,512 261.407,387.122"
          />
          <polygon
            fill="#59A4FF"
            points="109.979,349.668 131.608,362.133 131.608,412.085 109.979,399.597"
          />
          <polygon
            fill="#59A4FF"
            points="153.246,449.509 153.246,374.581 196.505,399.557 196.506,474.532"
          />
          <polygon
            fill="#59A4FF"
            points="218.149,399.632 239.778,412.097 239.778,462.049 218.149,449.561"
          />
        </motion.g>

        {/* Señalización morada lateral */}
        {/*  <motion.g
          variants={buildingPartVariants}
          animate={{
            opacity: [0.7, 1, 0.7],
            transition: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            },
          }}
        >
          <polygon
            fill="#A258CB"
            points="273.003,196.734 279.459,200.462 279.459,207.917 285.914,211.644 285.914,204.19 292.371,207.917 292.371,230.282 285.914,226.555 285.914,219.099 279.459,215.372 279.459,222.828 273.003,219.099"
          />
          <polygon
            fill="#B77FDA"
            points="273.003,196.734 279.459,193.006 285.914,196.734 279.459,200.462"
          />
          <polygon
            fill="#B77FDA"
            points="285.914,204.19 292.371,200.462 298.827,204.19 292.371,207.917"
          />
          <polygon
            fill="#7F33AD"
            points="285.914,196.734 285.914,204.19 279.459,207.917 279.459,200.462"
          />
          <polygon
            fill="#A258CB"
            points="273.003,231.6 273.003,253.965 292.371,265.147 292.371,242.782"
          />
          <polygon
            fill="#A258CB"
            points="273.003,268.329 273.003,275.783 279.459,279.511 279.459,294.421 285.914,298.149 285.914,283.238 292.371,286.967 292.371,279.511"
          />
          <polygon
            fill="#A258CB"
            points="273.003,301.33 273.003,323.695 292.371,334.878 292.371,327.423 279.459,319.968 285.914,323.695 285.914,316.24 279.459,312.512 292.371,319.968 292.371,312.512"
          />
        </motion.g> */}

        {/* Entrada - Toldo */}
        {/* <motion.g
          variants={buildingPartVariants}
          animate={{
            scaleY: [1, 1.05, 1],
            transition: {
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            },
          }}
        >
          <polygon
            fill="#A258CB"
            points="104.593,476.093 180.297,432.386 223.556,457.361 147.852,503.91"
          />
        </motion.g> */}
      </motion.svg>
    </div>
  );
};

export default AnimatedHotel;
