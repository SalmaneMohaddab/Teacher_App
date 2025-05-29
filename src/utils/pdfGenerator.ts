import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExcelAnalysis } from './excelAnalyzer';
import { amiriFontBase64 } from './amiriFont';

// --- Font and Image Setup ---
const FONT_NAME = 'Amiri';
const logoBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAgcAAABhCAIAAADN8ZUCAAAgAElEQVR4Ae19f2xTV57vkd4f+7qRnjL7x7yNVPepqvBI3qcZxhtAIUM7SWk9szXbkbB2H+Odqi7dtwV3mmW266pdF5B25fnhgqAb3ImIwENGjVN3AnGdN6I1CXG8owupEc3VOrWXXmbwsAU340U3VNb9h/s4/oQvp/faTkJCCcm1UDj33nPPj+859/s53x/ne5hu/SwKWBSwKGBRwKLALQqwWwnrf4sCFgUsClgUsCigW6hgTQKLAhYFLApYFLhNAQsVbtPCSlkUsChgUcCigIUK1hywKGBRwKKARYHbFLBQ4TYtrJRFAYsCFgUsClioYM0BiwIWBSwKWBS4TQELFW7TwkpZFLAoYFHAooCFCtYcsChgUcCigEWB2xSwUOE2LazUaqZA/nxiNXff6rtFAaKAhQpECiuxqimgjDBVVVc1CazOWxSoUsBCBWsirF4KqKpaujxRujxxtZg6k1yTz+7D5cy1K6uXKFbPVz0FLFRY9VNgdRPgajGVG2UfDm8qXZ74cHhTbpTls/tWN0ms3q92CliosNpngNX/SqUiDbJPpo6dSa65WpyyCGJRYJVTwEKFVT4BrO7rpcsTF8ad+ey+j8e2WoKCNSEsClioYM2BVUqBmWtXpOOtQILC6Z0fHngiP7wjf2ZP/sweaZCVLk+sUrpY3V71FLBQYdVPgdVKAEKFwtCjH3VsLP/1c9JX105EO6TjreP9rSsPFTRN+3KGWlEUr9cLh65sNmu32wuFQs2ql6RJ0WiUMSZJUs0q6t0MBAKpVErXdU3TPB5PJBKpl3MV3rdQYRUOutVlfXrqndwAu1pMfTy29cPhTeMb/uT3traz7I8noh3KCLtanJocZPkze1YApWRZbm9vD4fDjLFwOPwl9MjpdDLGent7dV1n1R/4L1UdCoW8Xq/P52OMlUolun9nCbvdTtXNs4RYLMYYs9lsuq4HAgHGmN/vn+e7qyGbhQqrYZStPs5S4N1/S2WzWV3nqCANsgvjzsLQo7OX+2dhIH9mT26UpftY4fROXdeLxeK7/8YXlffpL5PJAA88Hg/6vsiOpFKpcrncoBCv18sYi8Viuq53dnYyxiqVipgfGSKRiM/nE+8jLUmS3+9va2vz+/3zESZCoRBVZy6t5p1UKsUYa2tr03UdokY8Hq+Zc3XetFBhdY77Kup1pVIpfyTrun61OMWecjz4zBZd1y/Koyd7GIChdHnivV//mO363j//7ImZa1e4f+oAO9nD5HSPruu7ukPsKUcmzblG+SN58Wvbe0j6YDAYCoUW0wBZlueUOQqFAmMsGo3qug5MqlejLMt+v19U/vj9fogX+DtPGGOMLVQF5HA47HY7GsYYM0gz9Rq8Su7fB6hQLpfdbnfjYcvlch6Pxyf83G43PmC/309fQiqVcrvdxWKRRjcajRru0CMkisViKBTCFMedTCZDhRsy49Ltdov5KU8oFCJBVZZlt9uN78HQcq/XC0k/FAqJcz0ejweDQSotk8n4/X6fz1ezLmRD48VCSqVSMBh0u93BYPC+ZnBEByQURdE0rVwumzv1H6/tvczsY4fYTJZNZ9ilUTY5yLiR+cweZYTLBNMZDgCP//2fvffrHxeGHlUSPEPh9M7C6Z3SIM9/aZTdOMeUBPu9rU366lpD1ZVKBTMql8sZHi2ry2KxWFOfs9BGxmKxOTeBY4Lpup7L5Riru2k8EomgSWgDZIiuri5d10ulUjQaNQgZ9Zrq9/u9Xm+9pzXvJ5NJxma530JFjZoFrqSb9wEqlEolxticIp7NZhNXGR6PB+PU0tJCaWhXRdtXS0tLvYVGMpl0uVwoU2Ss8XicMSZCi2FCMMYIh8RHbrcbqkxd1xOJBK1QxGYj7Xa7dV232WzUcl3Xg8Fgc3MzCoQylF6ELCzWJTaeGiNJEl4hWi1zRib2qEFaTvfIR9pyJ/bK6R4AgzjEnDcd267LXF90tTglMpqZa1dmrl2ZzrDJ1N6pZ51nB346nWH58wlRcaFp2sy1K1ybJLNi/0aRIZZKpWKxeLU4dVEezQ94c8e254d3NGjnPX+EVfycn9Li2xmJRNrb26F/a/yxBINBcGdodWiuLqgN+K4X9AowEmsIh8MhfuALKmdFZl45qIBZpaoqhFxFUTBgNpuN1hHgifSIVk9Op5NGt1KpiGKsz+fLZDL0VNf1O0YFj8dDQmtbW5uICqFQCCymWP3RZKWW67oeCoUAKmgAzWPxc9I0rauri9BCbLyqqowxl8sFlqeqqsPhoOWS2MH7Li2ne5TDTDnMckfX/fZNljuxV+zCTXPrB31bbpzjtmXcr1QqvxsbuFqcWrfrwfz5RP7MnsLpnVPPOkeO+IEcHQH27r+lfjc2QNjP8SPLcqP8vlj4RXlUOczkI21oQH5gYStWsai7nS4UCovXoWPtD5tBgwZjTsLDhzFm+ILwoqZpkiTB5qzrOji7JEmqqlbm8RNrxxpLvDOfNHkueb1eEuLn8+KKz3MfoEK5XGaMJRJzh7Rsbm4OBoNerxdrbQweoQKsUowxQgW4ImA6ipoHKEPryZWYgmJ+wyypJysQKoCti6hALF4syuFwdHZ2ZjKZVCqVyWR8Pp/D4dB1vbm5WZQh6IsCu6/XeEjr4ioYQth8CCu2ahmmgQrTQ5umhzZxbDi2/XdjA7lcDrzljzwP/ZHnIV1m01PvvPtvqdd//hf5N18/y/44dsDx2C7vqbhvMrU3n93H/s4hp3sKp3eeivse2+XtPrieuyT5/uqXQ7te+fkrV4tTN86xv/2nR/7I85AscyuFLMtcRBjeUezfiKqL/Ru5UPLF38y1K78bG9A0Dbum78neaUVRsFBoamqqJ3ZjLdVYj4/vBcsOw6JenFe6rgMVcLNmjaQ7grBOUgUtaOZMtLe3U6UQgkUbOD2i0TDfIa4SCAQ6Ozspp5VY1qiQyWRisVhvby9cx3p7e8PhsHl0aRShK2SMiYoRm83m8/kgO2MKEip4PB6n04lFtGH5UyqV4PEmLiJisVg8Hof2Bkp/w1toSQNUoOrQEhhL6qmw0ADx87Db7ZqmEZxQxyH0gFtBJ2tuvNvtbm9vl2VZuvWTZbm5uTkQCFA5yz9RM27dRLSj2L8xP+DND+8AMMBQjO6USiVVVS+MOy+MO3d1h3Z1hyZTe1VVnUxxkSJ/PnG1OFU4vXPC91f54R0X5VG8O5naq2manO452PPiU3v2fDy2dTrDZq5dIekBJmvlMJse2iQfaeMapKPrlMOM5mfu2HbAxvTQpoloR354B/97L4QJrMcx2VpaWkiDhMkAKmFt1EB2hJwRDAYVRUFm8nOF0CniBFABKyez22ilUmGMORwOTdPwYdLEk2U5M9dPkiSACpnZRHWQruvt7e2MMXpKyyan00mjA69ZfL9YL1IbrMSyRgVYn276PGCNA/4Ixa4sy+Fw2Ly0uYn/ojpI13W73e5yuVpaWpxOJyYroQKxY6fT6XK5zLMBNdIjYtDUHtIIie82RgVM2Ww2S8ydmiEWAp+53t5eKF4DgUBvb280GoXkRACAV/CZGQzyhsZDZ0VdoERN70BDS+7tZaVSkdM9V4tT+QEvWLmhPdJ+zpo/O7652L9ROcx5tyGDruv/8drej/78vxWGHuV7EVJ78+cTn0wduzDu/K8890O9MO5URvjf3Cj7rzzHgP/89z2lyxOTqb2lyxP/+e97cv/nf058/TGRp6AKjhxH2gAM5fe3ibXnh3d8dnxz7ug6ZMgdXffZ8c3ykbarxSk53XNRHjU38i7d8Xg8EJFLpZLNZguHw6qqFotFuI0qiqKqarlchpQpCsGYe4lEQlVVRVFI2maMBQIBWZYrlQoYNCxw0P+oqmqw5RpmJuYwdrrhkywWi+XqT53fT9M0rKsqlYqqqihEkqRKpQL0QntSqZSqqgAe3AkEAugsPplkMqnr+h0Yq+/SSC2TYpc1KmSz2VQqBX1LMBiELgXCOzE10a2NNDMi08RChjFG8x6ogG8AOTGzRTukpmmYRqJmH5ocfCqxWAyX5oFsgApotizLWN00lhVQMjS51E1xNlPVUBFQrzVNwwcvNt7j8UBMpu9O1/WWlpZlLiuUy2VpP5P2c7PB9NCmYv/GYv9G+Ugbsf6Za1eUw9wODM1+PW578e3+33ZHrhancgPcm0gZ4W6pg31f+c3zj4wdYg9t3/hWmH3UsTF2wPH43/9Zuo/XeGmU5+Tb2c4nLr7d/x+vfcFcQcRHA9A8bmOoAhg3fR9pK7+/DWAwPbQpd3Rd+f1tQAjlsNGFn0q7GwmSA+iraZAQvwKyUfl8PvJQaG5uptfx4cDZgW4i0dLSous6dDvmThkyL/6SFmqMMThlGMpUVRUyk3gfSgXGmME9wdzgVXVnWaMCRgIrCxJ7dV3v6uoCLwsEAiLjg9gIvRCNIlABiwJRViDnB13XwVVJw056WDjJUVFILMauQL7eqIJQARtBDRXhEgpf0V7X1tYGBw/KD6UWLus1HkphUQGCkg3rOCrz3ibA9PlCb+jR8vvbyu9vgzSQH/DiUj7SdlEenbl2JT/gBc/F5ZzNPtjzYverD0hfXdt9cH33wfW/fZPz/bfCXFCQ9vO/3QfX546u+83zj7C/c3S/+sDYjm/PWaamaXBDmh7aBMEld3Qd8OCz45vRcogynx3f/NnxzTUlnjlrWUyGRCIBx2jGmNfrDVV/mqaFw2GkQ6GQz+czTHhYnmAYiEQi5KKNdCgUgrkLZULNGw6H4awB/ZLD4SDRXGx/uVwOV38Oh6OpqYnaMM8EJjx1hGoMh8NAMgCAz+dDLYwxj8fT1NTkdDrRZWCDruuRSIRUYWILV3P6PkAFs2eqv/qD6Ed2VyxbVFXF4pqYHTTsGGMRFQzb3Blj0KWQlIB543K5ksmkqDqARCKyV8MEaiwrQANmQIVAICBJEilURc2YGRXQi0AggGUd7C6Y2Y0bj13+WBZBhUWesoYu3PPLyRRfa3N/06oGJnd03fTQpsLQo/1HfzKZ2ks4Ie3nfkfTQ5vm5LMYwdLlCVmW3wrzbQrSIN+q9laYdb/6gOFf7IDjTHJNuo+NHWIX3+4vXZ7A6+I0MJMofz4BPyj5SBtkGkDaH0Z2/GFkR/n9bUCIE7sfHjlyb+IrhEIhKHlqcmpzj6CNoU/JnAF3oKES12eYwNlstsFnwncFlss0jesVPp/74XBYXFcBEogzkN+gGGBDUZRyuQzt03yqWFV57htUEO265HdPqnnoVcjeBYMEBrKpqYlckggVwJRJOIDfJ2O3TYXlcjkajZL2iUqmGdZgutdDBbfbTdY8AyqIUi3txUf7wb5FWYFaS28ZbAOGxpPZDXhJbzV2JL+3n0HuxF4st4EK0MYQewUqgM/KR9qk/TxyUc0GVyoVrjWq7kT7oG/L52d5WAs53fPuW5sNSGC+jB1wcHBK93x+lhWGHpUGud4pf54r2evVBVQ4sfth+UjbZ8c3T0Q70OY/jOzID3NggFjDrdP39JjoYDB4c+GcSCS8Xq9oh3M6neKmSEyVmp013BT1ToZHX8KlGbfM7WmM6F9CI++jKu4DVFBVNRQKictnXdez2Ww4HCZteyqV8vv99LkWi0XaSR+JRAhRCoVCKBSCgUHMr+t6oVDw+/1m9WKhULj5CYkypizLKKTeMHs8HqpRzBOLxcgDtVQqhUIhVNfV1RX84o+yQbvl8XjIZkAFSpIUCoVgbqGbhoSiKIYgB+VyORKJBIPBaDS6bL+T/IAXa22ChM+Oby6/vw0rbvlI29/+5cMT0Q6oaLi48MUNCkSEi/LopVG+dXlykOUGuJ1AGuRpWAsmTWncMfxN91XtEAleQm6Al4a90Ga+Q15JZGEeOfLyyJGXAQn9R3/yh5Ed1COOH3WaTe2/ewmPx9PS0iJJEuYeKoIzHi26yX5295phlbw8KXAfoMLyJJzVqrtHAbgbwYEHfjsQDoAKb/7oEcbYwdefyB1dB49Pc0s0TZsc5CEucgNVGBhh13P83/ndf/p7W9uC/n26dsNvnn9kOsNfV0Z4adIgBwYlUdvZiVySiv0by+9vyw94RREHqICu5Y6uyw/voKWMuRd3744sy429DAAJJGTfvZZYJS9DCliosAwHZbU36WpxSnTaKb+/DRwWeqQTux/+xv9ib/7oEc5hqwHsiF6QfmauXfl4bCs4OLBhJsvx4NO1G35va/t07Qbzv8vM/unaDfhrforwR+d3/ynfspDlwIB/0vFWaK5EqYsrrKqmDhhFgAr5AS+MCiQrYIMFtfzLT9y0sjY1NRlEcHgNQXEq6uW//OZZNd5DCliocA+Jb1VdmwLYMAwPVOiO8Je8PLGXmCPHLSUMxAvlMDcwfDy2VZc5+4asMJ3hLqfg9SIqXGZ2wMCpti07tv7DW2H26rbnTrVtQU48FfN/unaD9NW1SlWVhMJ1mUsP3Pe/6iwLp1g53YPtCwC2wtCjgAdcirLCvVUiwf0GlgOfzxcMBskPtaWlBT57tYfHurvSKWChwkof4futfwhfYTA1Qy1zYvfD8OzkupcBb/58Asr9/PkEnJGK/RtP7H74THLN5CD3MsLWhLFDzLD8P/bCn+9/6Xvbtr61Y+s/nOxh7IdD7IdD0iBbG+hjLwzHDjj+5YXnt219619eeP7E7ocNwHB+95/mqvsYTvZUdVMJ9kHfFrRW2s+j7BH3n1UTHdu+5n+wv/3Lh1GauK+NB/Wrbm64h0MExwS/3++p/uCkdA/bY1W9HChgocJyGAWrDV+ggKZpuaPriv0bISLARZX+Yi+bcphhbV4ul7GLLXd03am479Io+/ws1/t/fpb/O9nDsUFEhW95Dz21Z8/kIGMvDLMfDk3eAgNlZBYVcqOzicG+r+zq9n3Le0h8Xdo/G3z7xrlZy/PnZ2eBodi/kYPTse0ABvinykfaDr7+xMHXn3jzR4+c2P0wcAvSQ7F/4xe6bV1YFFgeFLBQYXmMg9WKL1IAingo6EWtC/hp7ui6Dw88IR/hZ2khamnu6LoP+rZIg2y8v7Vwemf+zJ7J1N7C6Z3KCDcLY70/8fXHTux+GALBeH/rwZ4X2bPpwb6vvPLzV9gLw5eqYPDka28oIxwwnnztDUKON3/0iPTVtTBLcPljhB/PIKd78mf25M/s4bLCKAeGiWjH9NCmDw88AVQgazkQrjD0aGHoUXJaBWaYo+l9kQzWlUWBe0ABCxXuAdGtKuekALTzJ3Y/TByW/HaQIFTID++Agn566h04ocIUfKka3WjsEHdIPbH74Qefi7AXhv/5Z0+cSa4B0780yrn/wZ4Xx/tb2QvD0xkuIhzseXGw7yvs2fSZ5BrAxpFffFc63sq1TC8MR1/4Fo5pKww9ingY8HGazvBTegifePDU6t5mGEIg5UD3RRIPtjrPufluTkJZGSwKLDkFLFRYcpJaBS4BBeR0DwIHEXsV5QYstLFDDeGPfjc2gACoJ3v4Wp4ckOBICjDgUsKzael465FffJf9jSQNsoM9Lz752hvXcxweZrIcFQAGszefTb/y81e46FCFhJGTT4+cfDrdN+ucyvc9VCvid6rhV68Wp7CLLXdsO8k0BAZQiJGBBGh3T0KoLsHwWEWsaApYqLCih/e+7Rz8O7GyJmAgU3Pu6DppP5+6FDqbguJ9MnXsZA83J4z3t876jw4ydou/P/naG+zZdG6UvfLzV8D6H3wucj3H8Bd3nnztjQvjTgKMtYG+tYG+yUH2y143e2H4yC++y/fEjfLyURE/pq36q1Qq/MyfaoiO/PDtDWvUfsgQJElI+9lEtOO+HSKr4SuWAhYqrNihvd87hhMLoIQBYwUq3HZLrW4LgCqfOlupVD7o23Iq7uOR9U7v5KJDgj0T2sf+RnomtG86w/GAMCAzuuGXQ7tyo2zk5NMzWXb0/Q3Xc+z/7t9+Pcflhpvb1p4J7XvytTdmsvwt9mx6baAP5ut0H/9wTsV9sQMOMdhG7gT3QYIcABMCgA3BU3NH1+Em7CIjR/z3Nu4FEc1KWBQQKWChgkgNK72MKAAlzIndD9NaGy5J2OeMTWE4Y4cEBb4J63grzk7gUUxO70z38XDZZ5JrziTXPPnaGw8+F5nOsCO/+O6ml19SRlhmlMPAjQvrxX/XczxyKsSFV37+ys1NCc+E9j34XOSXve7cKOPBkarbm/npRpcn5HTPmeQa2sUGhygAg9haGJzJAalB4KblMACVSgVh5MWzFgwNQ4h73IxGo2KgMEPOu3SJQDjYGV4qlXw+3zxD/jVujyRJfr+fBrRx5pX61EKFlTqy93e/+Pnb6R5EycZyGxGqEZVajI5HZxXMXLtyYdyJnQrj/a35M/zwnI/HtnYfXM9eGN7VHZrJcplgbaAvM7qhBh5cfNqADZnRDblR9uRrb/xyaNf1HDdCoBweI6961POpuC/dxx1VL42y0uUJUBz2D7GF5Iw0Ee1ARD9pf+1oGXcwZqqqdnV1JRIJm83WOIjF/AtHqFTG6h4CgdiOiCZJJ8KK5VcqlSVvlVj+zWOUEAETEcMQF7lm8DHDW40vKXJ4g9iXjUtYGU8tVFgZ47gyeyFy2D+M7ID0QMDw2fHN4vZgHsi6uqfsVNz3Qd8WJcEPwIFpYby/dVd3CB5H13McG0QAuHHx6Rr/Lqy/nmMfDm+6cWH9yMmn2Q+HnnztjZGTT59Jrrk0yiOnKgkmHW+lusibCJ5IEBQg0IwdYjjCk+JpK4f5juglGTMc3+R2u+12+1It2A0HPZnbiUpFVBAPsqUDS5a2VYZmIFw2UMHpdJoDAKuq6vf7i8UiDh0yvF7zklABTwuFgngWdM1XVuRNCxVW5LCuhE7BpWd6aBPW3RRjDqZmuB5hywJ6+/HYVgQpms7wxTuW8JdG2VN79jwT2jdy8mngwa5u3xe0RjUh4ZbccD3Hut/uOPKL785k2Znkml3doQefi8AnFYG14QuLYHkURTV3Yi8dzQZPKoqnDdMIbcFbknEiPU8ymaSIp4spGQHnG5eApTq63N7eTtHa6S3ip0vVKioZCZy7CVRAaH2iPzJAiMlkMuFw2Ov14hiSOekTCoVw6AiC84uHRhgasIIvLVRYwYN7f3cN6qNi/0YSDgAP00Ob8gPei/Jo7sRe0aLw4fCmdB93Dbooj34ydWwmO7sJebDvK78c2rWrO/Tka2/s6vblRr9oSLiFCh+Pbb0tMVxYz9NVe8NMluuObtohngntw+YGJcFLnsnyPQrFYvFkD9/CNjl4W9/CT4gb3pE/nwA8QG6AoECmcmn/7cM8lmqcENSoMeNDiIvGNeI8tcZ5oESCpsXv9xsOcRPfnU+rxPz10p2dnZFIpLe3lw6E8Hg8qBeNIXSkEgiZdF3H8W1iSHzKJiZwZCHuxGIxc2h9MfNKTS8BKuCcP/PBF2aSpVKpiOlnOE9GfEtV1XA4LGYoFArhcHg+Q5VMJnGyQj1Rvbe3d05FZCwWazyNMplMJBIxm7lkWcYMNp+LEI1GDTQIh8NY5uDYQvNTkSZiOpVKiWekiI9qprFuMiypxJwQtyNf/IlVoF90rAW9WyqV0C9xsOjpHSRouQ0/TgADWCpC4BnKLF2euFQ9Wgd/89l9+ew+ruQZ5IaBgz0vjpx8+tzZ1gvjTvD6zOgG7D94/ed/gX/s4EuU7n67A0/PnW29cWH9hXHnubOtIyefPtjz4lN79sQOOJQRDgnTU++gOmxcyGf3GVqlaRrMIeQ9BUEHmqUl36wABYh52S62KhQKMcbMM1bMY7fbxQOpxEdims68CgaDDWJuz6dVYrH10i0tLZFIpKury+FwIA/OxcKZbvM5exknidYrH/fnIyc1LmEFPF0CVICo1XguglIUlBHLB/xtoAzFfBL5MsasMQLdZG3i0d6MsZqsijFmOP3YPJydnZ10epr5KY7qRC/EzwynyFIfDTZA8S3koS+KjHj0LhKGqovFIr5txliDNZrhLTrBTVxAGfKIh9xRG3Asu67rOCsU98UhwPKK8i8+AjNU89Ad4SRkaT/DOTzS/tnwR2LLZ65dmd28luBbzBAUD5bnf/7ZE+zZNP/3w6EHn4s8tsvb/XbH1gObtx7YfO5s6/UcS59bv/XA5u63O9jBl374zlM/2N8J/9TrOfbDd556aPvG7rc7dnX72F//lO9lqxb11J490xkulNBWamBDuq9224AEiJIEkIDNWTnMLR9iRxaZxgA1/hI1Tav5Oei6nkwm/X5/e3s7TqsVpzR3uCqVxEHXdb2trQ0KHFin6zV+Pq2q927j+9ARIQ9BVM1XUqlUOByG+UHMgBVtLpejm2it+I1kMhlxYaTruqZpN23pTqfTQBAq5H5PLBkqNGDuRCMIcZFIJHrr19vba154Uv5yucwYWygqgD3F4/FyuSxJUktLi9kSpet6S0uLy+Wiumom4J9X85Gu63ScodPppO7juJKurq5i9SfaxKicpqamzs7OUqkEOxiJPkAFr9d7izz8f3x4uq6rqhqPx/HRoo9dXV3ihKby6yVQXT3hCbH1GWOBQIAaIEpUgUAARsWuri5CMuC02+0uFArUowVhlbm1CCgExQtQAVJCvTMJ8ucTn5/lWh1sPJ4cnLUrTGe4oPDka290v93R/XbHD/Z34uydv/2nRx58Zsvjf/9nBz947cFntjz4zJb//rMudvAldvAlXL7y81d2dfse2r5x3a4Hc6P8vJ2j728AeHCr9V//dDrD67o0OnvQAqr+/OzsJmdDjxAFFqowQgWc1qkcXho9EqYZZkVjVDC0DZeqquJMhabqjwCeuJ6mabgpngXrcrkw0FjomEsWW0UfiDkb7uCIwHpPa97HIgYcnDFm4N14pVKpwEPJ6XS2tbWJRzfruo7ZyxgjGMA3SJ+kruvouMiFcNQu7huws2Y777ub9wAVGmgwDOS7A1TAskVcDeHcQYOPxJKggtvt7urqwjQC70aDxS9H13WcdS56QGNxraqq3fo2VdYAACAASURBVG4XV9ZiUQZS6LpeLBabm5sxF+8s/P08UYF4gaENoVCovb29WCx2dnZSHxljdrtdzAk55o59+2BkJmd/Oqym2L+xnpFW0zQYFWBXQCTtyeqJaVsPbCYkeGj7xk0vv9T1/z7Z9t74ppdf2vbeONIPPrOFHXwJwPDgM1vovjHP3zmAEN1vd8C1CX8/6NuCqNrc2HDtikgKpCH6kKxD9vPy+9uUw9ydyfzKgu5gOkEkxUkJ5tcNE8ZwCb6ZyWTAZyFPYKaBXcJUizu0qqBpAN5K91E7vkRqVU1UEJsxn4ldqVTERSRaC77c3NwsMm6iAKziAAx8X+LMJKcjWnvBvUqsBes80hnQOaY4UN2gCaB67+vEEqACyIRRF3mfmS6QFQyzx5yN7twBKng8HrgQQNuIojCuVCwSNpsNskKDNjeWFeDAh9kMqEsmk6S01ao/XdeRTQQqLECw6hdXJY1RAc3G+stut9/BImWRqICBRn9RO/xAxG9b13VoFGsu3AxDUPNStNBC00Khs3FEs7iXWCzhk6ljk6m96T6u8Z8c5EEvePy7pxzE3De9/NKTr72x7b3xp/bseew7X/t+xzde3fbcP7auZ7u+xw6+dOzxjsd2edmu773oXP/qtue+3/GNx77ztXXP/2Dbe+N8a/Su7217bxzvPvgMD86KuHjYKHcq7iPPVGqSqqq/GxuQj7RJ+5m0nyHcN1nOyfi8eOtCJBJhjOFUtZqGXwwTjQjYWTweB0+EXjebzd48nU1krCgWb+GcZ3yPNJOdTmcDWQGTjVplXpYZWqUoitvtFplspVJpbm4WvYAMCw5okEhWqGkmxHTFoODzNBulXS4XNQ/foOHjAuyR8Y8xFo/H8RWTkYPGfQUkFoUK0NPdVPKIenxxbAwM90tAhaamJsxUjC4YViKRYGzWQxxtwFyhv/WE7saoAA4o6nCwpMK0aG5uBuqAS4pk0XUd6ztaceOV+aCCruu0yYgWOPUmooH+i0QF1CLLMhWLz9LwCeFrET/ves2reR+uR7QLDAlYayE38D0Kx7Yb3gV3/qBvC9S+SoKjwnSGYe1PSMAB4NY/YMC3nv8u1x3dulkv8a3nv+t2uwEMm15+Saqe6jM5yI9+4+GYsvvSfXz7AhhHpVLJHduuHOZgQE5H1AVytIUSCQGdDN1Z0KXZUkUTe84ELGfI1lb9ORwOm81GL2KOkR2LvnTkgb+Tz+cT4QSNv4NWNTc3i18iLeSpMYYEtF4Qo2ktbyAd8oRCIcOSX8zmcrlIlInFYp2dneJT0qxi2uNzZoxBcCerm+GV+/ryLqICNCd2u510do1RgYyZNEJzygo00uTq09LSAlTAlMJSBRMUX2xNVKAaDWM5JyooipJKpVAy8WvMHtK61kQFcHZxHUR7f+bk9aQMxYLF0Ga6hOzc0tJC9DegAqkFSGUEkZwuqShKwORIqy2sOpcWFRBDmzRIBnggOy2CpKJh3Ad0gMNAum/2hE4o+meyXFb4fsc3cDrCp2s3fNSxkU/LKgZ4PJ5jj3dwVNj1vX9sXX/s8Y5jj3fArnDs8Y7vd3wD2b71/Hd/tX49ncjGZQvXN5URLiuMHeJ2hZlrV6TjPFIeVyhVg6f+9k0uGWALXuOOwMuWyHvHiVgs5vF4SI70+XzeWz+Px9Pb25vJZDwej9fr9Xg8sVgslUohP+ZSLBaLRCKwG3m9XqhG4/F4KBSig52j0SjKb29vJ4OBoihw7qjZ8mg0Sq2y2WzUKrfbjQ0E1Co0jDEmqm7IndThcPh8Po/HoyhKMBhEz4BnWFd5PJ6ak7ZUKhUKBSxeA4GAy+UyoFexWITJhOo1GB7QL7xLfYxEImhSU1MTaSbo6QpILAoVqP8GmzAdCZtIJBwOB/G+xqgAzwewSwxSY1TAQhXfA60UMF+pYUjAKchw02azkcnU8IguG6MCcWeyVqFJBFEoB6yWvi7SsWAVQ9NxnqgAIGxqahJVT9RgSoDjJxIJp9NJ3RRRgeQSKBCAZI1RASI/1mvoI6DXIAbhJukrqEnzScxcuwJ9EVQu2AtGbp2EEDBBU4H58wmD4ReXM1k29awThzPTeWqXmf1X69cDGwAJ657/AZ5eZnaAwZpvr2W7vgc8oBcp8VHHRtouB/jJDcw6PuXP7OFL1/6NokOtWdxB+CZCjno6MergPBN3EI9IkiTzRKo3dpjwaEyxWIQqac5FjLlV4pxv3DUYPOrlicfjmqbJskxKLUNOg8BqFgIURbHZbLQBAlo1iJvUSHwpho8aFYFlGSpdAZdLgApYCxuW2wTL4kwCKpD+QSQfjDwwObS1tQHSgQritAPbxbogHA6D3+FdLGBRnTitodYXJVPUu3gfJJvNhnY2NzdTI80Or2Z/OMjjqqo6nU7RVEucWqQMpVVVJXk/FAo1Ns94vV6MCCiGQkRUiMfjzc3NuM8Yw6QHKtT7xvx+PwAeKzu8C78OcUwBzCRPUPvnk0BkbNhsZ65d4ScbH2kD96QDO6F4yQ/vEAucnnqHH3iQ4LaES6Ncd4Q9BMrhLxzPSZwdcgNQgbj/xNcfe+w7X2O7vvfQ9o2/Wr9ezEzp39vazu/+U6AO6sLfyUGWz+4DHejoabIiQPcFqOPB/k7sBRLQWaRiX5Y2HY/HXS4XXBWI0zWuIpVK1dyvYLfbaZ43LqHx03g8HovF3G63oVXZbNbr9ZLkDTOAgbE0LtnwtFgsEsc3PMIlFLk1ZW6oHMDcyOogFgJWU1NGEbPdj+m7hQp+v99ut+dyOY/HQ4wPqBAIBIK3foFAAPMPchwOE2eMYfkJVHC5XLeyc+GRHJMxotlsFstnYkyw4gaDQUmSSElCU40G6S6hAlrV2dmZqv7ANEV7LDoFlCK7H1oFVBD7GwwGu7q6AAClUikSiWD1hAW7x+MRRRDqGkTvlpaWXC7n9XqJ+4uoQPgKoyIcM4AKXq+XCI4ESsaZ7/CqIvkPXbi54EokElAIMMbu7EvmZyoM1HDhvyiPmh06DZ7++SyPki26BsHgDHGBeLoh8eAzW9Z8ey2XG55yrPn2Wly63e6Htm/8qGOjITMuP+rYCLdUgJBS3SEBX9iPx7bSEIh2BXKxNSAZMsNDafGeSFS1IYElCIZpnqigqqpZXY6P11D4nV1C6Gxubja0Ck0lhSd8yhuvfuZsgCRJTU1N5pV+uVwG34hGo26326BZwv4Ml8vV0tJSE1cgENd8NGeTln+GJUMFw2Kc4meJm8hq7mIjKQ/sSfR0BOkNJiZCBXiX4qm4hKlUKuDF9KLoi0ZDwhhra+MH/zb4AWDqZcBiAbXQVNZ1HcyXajcoWLCUprkO32dAGlCBXqSEYd2dy+XIoIIVjbmFIulo7W/46kjyoCEAVFC9lED5Zg0S7sOYT5kNM8Hctnp3JlP8cALzUwqIJK64DagA7syPYEvt1TRNVVW+t3mE4wQ/zHnDn5BhgHj9scc72FOOf2xdz7VGrm/in9vthnXB5XJRTkp81LERWyKwt3nm2hVN0/LnE6hlOjNrfEYX8ucT8D6CxIBYfoZmz+Yc3rF4TyQz3RZzJxwOezyeTCYjy3I2m8UsFSf5YgrHwsIwq1EgPoSbh2Tg06u5il9o1eVyGTZOLHewYGWMOZ1OQgsorjs7OwPVH1THmNJmaQBCDDmwLLQ9yz//EqACNoOYtZN8u78kiTNJlmWsoMW/NDBQrIuLX03TksmkmBlpcT5ls1mztVPX9Ww2m0qlGiyO4J3deIRSqZSBpxvyw9pMLJ6ewiqbSqXMjxKJhNjHUqmUTCaBW6qqmvubTCbNgg4qahzxAvQ30CoajZJQhe3Kog8VNdtAc0O/zCirqipeMT+id+dM8FPM0rN7fRFEiGuQ0j3kyUNePcph486AT6aOSYPcC+hqcWrs0OysRmRTJcFjFk096zQAA2CAb1ZwffPY4x2frt3wq/XruUXB9U3cnPj6Y4QHeBdFcWVR1X6g6zrCLsEXlm5ST7nWO91zYvfDMJCYT4NATogL9UaZSvuSE7RKczgc4qprSZoBibnmx0WLjMYBnRbajHK5nEwmw+FwJBJJJBI1J2o2m+3t7Q2Hw9FoFB8prW6DwSAM8oAKl8u13MZroQRpkH9pUKFBBdYjiwLzoYCmaRTgiLZ90VpbOcwPs8wPeHHWQk19y8y1Kx8Obyqc3nkq7qO1CHRK13Ps87PsN88/QsDABQXXN9lTDuDBp2s30CPChu93fAOo8Htb29SzTmWE6XLVYpGYxSRVVSdTewund0rHW+l8BUNnueWgGkIVRgUCBtHCXKlUqO+G11fwJUnGfr+/t7c3Go2SBNze3i4uVu45EZLJJNyQOjs7g8GguKq75227Gw2wUOFuUNUqc8EUMHDGDw88AREBW5pJhjCUq6rq1eJU6fLE1eLUZGovMCDdN+ulyq2+I9x/VJe5uDCT5Z5C0CY5HFx3VM948OnaDcce73A4HBNff+ws+2N+SE6WF3I9x0uYznDjx4fDm+ALm+7jlu3C6Z1oSenyxMy1K1eLUxB0KKS2nO65KI8i7gXCgFPAV03Tpoc2iThh6OYKvozFYl6vF9sgbDZbMBgUlQcruOPLuWsWKizn0VlFbTOgAo9tcCsi3ocHnqhJCOhtREcgxLiG99Gl0VlvURyHcOMcu3FuFh7GDs0qlEg+IE2RmPioY6O0nwsZn5/l7944x32clAQvFublS6McLWBpQC3IwGO1VvczU5BXQjVYoX/7Jsud2EsqCFVVV6GsUHNMrZvLgQIWKiyHUbDawClQ7N8oxo2A4gWLa7MxVk735Aa4EypW8firy5xfz/qkVk3Nl6qx7Wh7wUx2lsVj1S/qlAgPZvVFh3nJ13McSG6c4/IBAitBiQShhByQ+DE+VcjRZZ5/OsOPd56IdqDxuRN7McDokTmaEzRmZhOUNS0sCtwTCliocE/IblVagwLTU++IR1dyW/FhfrYldPH5Aa+madDSgEFPZzjjns7wf4QKusydjmY9hapLe6zfscMg3cczY+0PDq4kbtsbZvGgap0GGEBQyA3wAglsuFhQhRycEQ3kIDy4NMrLn8nyUNu5AZYf3gHVEEECgQSR4LPjm2s6rVKGVZ5YtSdl3qtxt1DhXlHeqrcGBbANGA8oeCpCR+B8ArghARXAfIEHlJ4c5EwZPBp/b5ybhQEs56ELEpf2kBvGN/zJb9+cFQ4ACZTTnKDyIYVABKE2AEuwk07az3775u2ASLmj6wzdBlpYgoKBLHSZyWTsdru4L5UeWYm7RAELFe4SYa1i74QClUoFe77gPjsR7VAOc64Kmy3CSPAopMdbwethQ/787KzEAI0/rM3j/a0IZSqne/LnE/g3PfVO/syej8e2KiOzQgOt8ZXErLIIMIPDnz8e2/qf/77nk6lj/MVqIXK6ZzK191TchwDaFEMbG6oBDGSKUEbYid0P546uIyOzwaQ8meInPBtu3gnhVu47kiR1dnaGQqGaexcs0/TdGHkLFe4GVa0y75wCfF/YgJd8crCIpoNrJqIdHw5vgk8RwAAxiE72cI3Nqbgvn903z3U3j7lUPWKTL+qrkAAR4dIo344wT07N3Yem3imc3gmQSPdxWzQQAmaJC+POD/q2zFpHhCgdlUql/P62Yv/Gmkcy3Dn5luJN2relqmpvby9ZxZei7BplZDKZBkMWCoW8Xq+47YaKwHZRAEOhUKi5+4EyLyihKIrH46lZaYNyiG6apvX29jboVINClsMjCxWWwyhYbTBSADBArjs8WvX5BFg//H9g/v2gb0vp8sQi2RY/LafqeAqHItrrYGzTPK5h+TgV9+GkNjgmzTa7Gk4VZZQuT9SMB46niqLEYjHsKK652WoeDbmdBdt6b1/PlUJ+xGhBuGxidnO9eifPESGmZqAhFIc9qghdgzj5tGsVG8pisRjt5L+TFtR6B3ubzWEwauWdvYfADUCmJdyY3aDGu/fIQoW7R1ur5EVRAHYFMsN+PLY13cfOJNfA8Mvtyam9pcsTk6m9Hw5vqrmvbT7V588noIYiicG8RXk+5ei6frU4xVtyZk/p8oSc7hnvb700yndLnEmuGTvEbeAoB4DXoMGIOISgihStpHEbgsFgTQULbc1t/Lr4FEiA0sB2FwOTYsk101jvU1itmnmCwaDP50NMPYRpoeB9OJgTkVrMIVFrljafmwhLsyBjBoKCYD826LZ4RJ9PU+9GHgsV7gZVrTKXhgKqqvITCKqKl8nUXgS0UEb4JrXx/lY4BSFKHff2uRWFYkF1c2Zd9SWV0z2XRnn60ujsAU0LKueTqWN0kjM8lMb7W8cOcW+l/PlE4fTO8f5WHmIk3TOnIUFVVYCBOWZJzSYhsmTNiFh4ROEpa75uuInFO9guogMZMiztJXCrgaxQLBYNXUMLscHY7XYDwFwul+EMq8W0E8LHguJ8iNGaEShpMQ24t+9aqHBv6W/VPgcFZq5dQbgLHHaGnWtjh/ju4qvFqUqlkj+zRxrkrFxJLNhsy00LVa9W7JPIn0/AUNxgIV+zuTysRXXPs5Lgm5xnrl0pl8tyuudkDxcRPh7b+kHfFpwpbd6sULNA3KTjzOZUkTVQYUcikfb29ga1mB8xxsAQEUNXDJxlzrz4OzcDJzcIPmqI3IXqEOcRUfaACsFgUDwCffGt8nq9jWEmFAoh9hdFCLbb7QgNiQPE5hy1xTfyLpVgocJdIqxV7JJRAOtraJByA5z709GYqAOHcRpuzqf6i/Lo52f5cp4Yn3S89fOz7JOpY/N5nfJomgZrBzdRXLuC+5qmkfSQG+DYkDu6jhRi9G7jBLTVi/G0QRy6xrUYngYCATBEnE3SAHIML97ZpXgEiLmEerXjqGqv1wtUCIfDc4ZANhfe4E44HKYQ9OZsOHchGAwiPDMyhMNhaLEgapD9w/z6Mr9jocIyHyCreToC50HDAxsA9PVXi6nS5YnC6Z1Yp08O3mbu86TaRXl0Jsv5NeXPZ/d9fpafn0N35pmQjrfCMjHezyPllS5PcB1XdUPc9RwXZXDy6Dxdm6hS6CXmDBVXKpWi0ajf7/f5fKFQyMCPap46SVWYE5BRcMYAY4xqz2azgUBAPCzE/O4d3AEPJYefWCwWCAQMXTAXGw6H4Z4EYzi12ZwTd3hYEUWp99R8H3oqWi7ouh4Khcieoes64Eqr/vA6BguPxNNGc7lcIBAAepkrWoZ37gQVGkeoFjuZzWZrxrJGAGrzCqhYLIrRpyVJIv8HSZIyX/ylUimaSagU8ZzNMb3FJtVLo+ov1sCDy+O4vlQqhW9DDJ0txuJOpVJiJEVN01Kp1HxmYblcFssRm1epVMx9FDNQGo03UIOemhOpVMpMJVQnmshAc7xuOLFZ1/VcLifaQsvlsrm1hgE1t2Q+d64Wp2BdwFFrZByGTypCXMCddD6liXmuFqc+P8vjb9PN/Jk93OF16h26M88ETlnADmo0DNE4ZrJcuFESfJO2cni+uFUul8XDSIgv12wMhbyGkRN/Rf7V1tZG35Esy3MaUUktDrME3oU2yVx4zSbRTVmWe3t7xUlFjyiBWvD5wNKOWmDlNnMJvCjLss/nczgcIA44ssjEqXzE1UeZjZVC4ivoL0kqFM+1AXPHK1AcMcaQE/IWap+T8mID7mF6wahAR6/M2WgaYNHBQNM0uL6BTM3NzSLrBD7TNyCe2grXCLxFf2muozGIzO5wOOZsmzkDqqaSkUDLMWtxGig85NBCHNyBohhjdDyyrusQ2+cMEA/1KFUq4gpKwCPxvrnluq7jYGrSb9bMQzfRHYPXnaqq1AwCcrvdTkI0OAXBAB1yRxphfBIiM9J1HVSt92FTk2omuEd/ucwtB+cTQAVVVQundyI+HbBBSfDNaNLgrN5G07RyuVwqlcrlcj0GYahrFmmqah8ulFR3t5EWyJDZcKmqqlhXpVL5eGwrLBwwV2DvgnS8lZ82Wg3dcVEeRb+I3RjKxCU8IyORCDTU9EWImbEIALcKBoPgoZVKhUCCeHEwGKS5gVFuwNp0Xcd3hBbSwYher9dms4HHmU9qExuGtKIodKxTY8MG5h5mHWMsGAxi2mCKhsPhmgr6crkMB1A8xfSjLovtkSTJ6XQ2NzeD84gMR8zGI3EVi3QHgb6LxSKURe3t7aVSCcoukaGJSzG0AXfINgN0z+Vyzc3NdLw81bI8EwtGBWIHxCBqdgwjLcsyKEUjgYHE8ZnwcGCM0ahDDMQylvgUyoejXldXl//Wz+fzGdgN/MkWKi+jfFTt9XrFKsgJweFwMMYURUG2m+fB4suhc8cYY6KxCzy98dIAkODz+W7OWpTGGKN5GQ6H29vbNU3z+XxzutzhU7fZbDXHwnCzJirAJqlpmt/vp2/Y6XQSxBpQgTGWTCbx5WAm4LRFg3oB5KrJ1AytoktZluHvPzk4G5107BCb3QV2PgEH0Ivy6IfDm3iIutReOd2TSccnU3sR15oECJzQ+UHfFjndk81maY5RRUhAZQRxoXB6541zX1AoGTJz8SgdPxX3jfe3pvtmoy2NHeJ2jrfC7FTcl0nHZ08KGuQOqfnzCZy7UKlUgApjh3in8C/dxz7o25JJxw216LrOGKPRFHU4lBOLM3BPM4sXuaqu6/F4nMYxm816PB6Xy0VFYY6JcxWzERluLn2A9DabDQttfGUiN6SixATgKhQKAaUasAtokHBCF520SEclKopCpBDLxzSmTwP82oy1tPBqa2vDFDUsJalMcCoqAWAAxtXV1UUn43Z2dtKKKhqNNjU1UQmQVwhNQVKXy4VGgiBmGZ1eXz6JBaNCe3s7MegG3cBIF4tFTF/QAlQT5x+eEm8VUYFENtQCtG9QI74loM4d7HJE1YRehorwFMIB/QVOIOdCUQH8VHS5AwoStIRCIQgfXV1djc1oWE7C6lWv/WJ3aqJCOBwGpxAdQhqjQiaTAfjhM1sSVHjv1z/G4TYIPYRwFFw4OLrus+Obpf2c89J3q+v62YGfGgIfXc9VT0EY5a6reB07jdN9/NweOd1j/iwLp3fCJDCdYRfGnQb8KBaLmXQcTkTTGR4bFRLApVEeGBWerNdzvDpETp0cZCNH/GIjeZCMQd6FYv9Gfk6nsI8aTrHvvrXZINmABzkcDpxd3NnZ6fnij5bhjDGHw4GHLpdLFKlpdoHfhcPhQCDg9XrdbjcBP87jw6qCaoHrva7r+DwxeSC+QCqtCVTiHEMay3M6Sbe9vT2VSmFii70BzBSLRXwCNpsNx7OTnIrlYzweL5VKqqqWy2U6rZ3WhZFIhL4dsSVgVugRScNut1tsgMfjAd9ABjxC2ul04gQIetdut3u93kQiQTiBb5/egsxB53eid36/H2dINEBHsdn3Nr0wVMCw9fb2YnI0bjqGljFGeA4CGd6ChIWbxJpFZRwezYkK4EqZTMZms4lLIUN19S5RdYNVLQnmGF1a1KDAhaICSjMwIMhhYCi0/8hQkbn9KAoUI+HGnE28Q+It3axZXQNUoCUYfbo1UQESxnywStf1TDqOHcuTqb2ZdLz/6E+6X30A0U+BCjw+RPXkHKyvYwccdPIBYmB0v/rA9Rx7afsj3a8+kKsG2UZEVQpmByNEum92XU8LXm66mHqHzlNTVfWiPAr5AxbjG+f4/mdlhEPOTJaDBy5vnOOW5MG+r2CPAirCHulSqaQoysme2Y3T00ObEOYvd3TdW2E2cuRlCBbYWf3er39MYwFO3dbW1tTUJHJ5YkyMMZqE4LxYq9ntdofD0dbWhtGhJS1GIRAIEHOkR6iU7gOEGGNAFPLw0XUdheBYdcaYGVzF9iONmQnLXDgcttls8XgcTEDsC9J4BU/RDFFEoNrFFwn2sCKsudvObrcjmyRJEFxEbi6WJnL/pqYmtKG5uRm9aGpqkiSJQBFAlUqlMExENyBTV1cXrX0hxAC8RRO0mVzL587CUAFjk8vlkJhT351KpUSVgt1uhxBKMqNBiQnWLMtyU1MT6QFBrDlRAV8CXAVErdQ8aT0nKui6XqlUIMGYZfaFogKOFDe0Dat+Wv6USqVYLNYAqIgyUO6DKRjKFC+9Xq/D4cDqqaWlxW63NzU10QChOqr95tA0QAXOxDOZeDxOwCaiQqlUamlpcTqd+AJtNhsSNb9bauGpuO9kD99BVigUPujboiRmQ1LDkACuinio0xl28PUnpjN80xmAATGRZrKcQY/3t3YfXP/S9kce+87XgBD//LMnug+uBwdHCeDF6T6+9/hU3Ac1lJzugXYITk2zksoIFw7wLra5jfe3vrT9kdgBB2SFdB9XH00Ocu6Pf3jx4OtP5AZ4C/Evd3QdL3ZoU26AZ7tUlWYAb+++tflkT+0vsbOzs551CoExiHqGhCRJxJjsdrs4iwgL6RUImpVKpVAoaJrW1dWFnXTxeNz8jWM3sigMUTmGhN/vF41teKppGqlJcSccDpMpCxACLm9+FyYZQgjSBYXD4XorD6fTSTYVQ/MaXyaTyZrCR823QN5AIFAqlXD4szkb1nxm4ptz3vM7tedivWaRiAChYU5yl6s/Ks1ms2ETI/Qn4EcYY0wysGasjwqFAuzVeH1OVGhuboZQIrInqtqQSCQSNpvN7XYTn5oPKui6jqEVWSdKbowK2WzW6XS2tbXRCsvv95v1Qljvi9+h4fsx9ILM2hARsKhpMO3w8YsrTfKUQMmG6hqjQqVSEesSyS5KHrSqZYwRtc0d0XV95IifR7lQlMnqfuPJwVl+PZnaO97fys89vhXWFGDQ/eoDYNMUFptOWYAeCct5HLeQ7uOcfXKwGnmietbm9RxPU/hrApgzyTWIrY0jOaczt8NrTw6y7oPruw+uP5NcA14PsUBUCkGqMLQNAbdP9sxqsU7FfQCMS6Msk45rmtb96gM1abKYm9CjFotFggR+wp0kaZoWiUSIrWMxCy1ub2+vOKa6riuKQuiCxjDG5imLm0VSlCCu8Wt2EB9CAz1wIpGg0EXfkQAAB/1JREFUTtUsgW66XC7ROEz3DYl4PJ5IJMBzoM0LhUJEIkNm82U8Hq8HS5TZ4XCI0g/dX4aJhaECY4xcu6BnbNAlUjKQuOrxeMh7gRgErfFhFoNMh/URgRDWraSsMFcKNkSrKrGd5szQlsKCRFa4OVEhk8lATgSbc7lc4vfTABXIYCBSDAsuQ9vQBrDmSqVC/NTArMW3YBgESqFfDb4lgDQENUz6UqmExX6lUoGPhGgsaYAKaKpIZxEV4OquqiqaBwuESC6xC5TGOcaZdPzzs9yQSwiKDKqqnh34abrv9ur7xjke+gIhKxAG42QPv3Oyh3W/+gCwBMt8Xea23zPJNcoIT8QOOA6+/sRj3/ka1EHQMikjvKhLo/z167nZY3aCgf+ty9x+MN7fGjvgyFVPdkMVk6m9b/7oEarxZA8XKWAn6H71AUgksI7A0mAYRFVVIWqMHPHruk5nOBM1Fp9IJpMG1ollFuRdWp5DjKPRaW9vN3DDYDBInzC+VvOqyNxaOPzQZy5mgFOpeMeQRpMMN+/sUrSTNSgBim70rmabG7yLR3BSqpcNK7b7wqjABbV63TDfh36DXA+hWTN8uvQWWE8qlQL7wJxDmuQ+2u5BSIMMtIiePyrA6YIaA1uFwYJHbaMYAMASTAJUTSVQZiRgrwNiEbMmgxIEXnFJAiTAIov2tiAbvkYQ02AGgFYHNYZCIYfDUSqVXC5XA0kWxhtqrWjFoZvmhHkRFw6H7XZ7sViEIQ6vNEAFRCUDWSDcGFABJaDvBt5kbo94R1XVkz1c7S7epLSqqu/+6xbojsBz3wpzbg71PXmF6jJ791+3QJaCrRhigS5z2wCsAmeSa94K87U/vEgRem/k5NPiQW+xAw7ACc7+HO9vzaTj4O98V1r1GDhUOpPlzUj3cUAipRZOZKu3isyk4zzydi5HvVvyBJn0UDKUhPDfxx3o8cV5KHoQUHs8Ho/X6wXTFDNTBjFBGp4G4JFMJjG9xRchmgAS6n2JhvxzXpJto3FOtfrDhGmcs95TTdOam5uJPYrZAMPkUyM+Wp7pBaAClre0pgDfrzdFoCPSNA3ZaIzBUuPxeLlcliQJyiJaRoE1E2UNqNDU1JRIJOK3frFYjIrFwoRIDGZUD5mBZ3yxFosRZ0fV4XD4VvH8f2oJXBSSySReyeVyGGnqPmPspsWPmocqgAqQ0BVFAQ+lTwUmvkgkUiqVcrkcvEqozdinqut6MBikPQHUQUowxsTIYmgV6fopm5io6YME7xRYZQiV66ECSgDxGWNo81KhAszO/Ud/IrbZkO4/+hNyVfr87Kx8gANwcGomtzYPcOUMvcgV5VWnUh5ytWqxgAroZA9XIsG19K0wtxCQJQDR98h/lGY+nHNwtg/cUpXE7TYAsaCPAjJRGwyJi/KowchsyLD4S0mSDFuCqExZluFvbdbnYE3jdDqj0Wgmk0kmk4FAAFPd5XKlUin6YKk0VVWz2SxggzHm9XrnXHHjI/X7/YlEAjYq2slE3zWVf8eJWCy2oOCAd1wRLCK26g90g8MVlpLEKBZT/pf27gJQobm52aAXs9lspBEytxiYD6cFeipqnEEv4oPmTU+izxJmMF6hv9CWwLNYnNxgWyK7pAaQLh6FUB6weyoZCeisUBp0qaKEJCpYDS/ikjRa5KIg8vdKpUIkMuSn3ZhATbNxG90B3pC5WNd1AE+9/HirJipAdkF1pIMSNaFYANJgkYMZY7P7dRugAgGhOAqN03NGhsik49AdkVEBZ+YQTz/Zw3cD1KwFzqZkW8ZGB+w/QAy7U3Hfe7/+cSZdV1ksp3veCnM4oeoMCSXB/VNr1k435+wj5VxMAssdt9sdi8UkScpms/F4HMpMbDqpV3g0GqVsjLFAIJDJZLBQo9mOfY50iT1o9WQjc0WlUikYDNJXABwyZ1vMHUThXkwJC303Ho+TTxfoNn+CLLSuu5R/vqhQqVQQI1BsB8Cw3sq0Ut1mGYlEDBk0TYvFYuFwuLe317CguOl9FA6HaVGWTCZJodnb2xs2/aC7UBQlFAoZWM/NDSb0rthmpMvlcjQaFflpNps1Fc9bCNejUCiEzPBvQwvRBRRoflf0rECXazLrRCIRDocjkYh5/YUmiQo3Q0cymYzZJmaI1mJ4hVpL/J0ymKsLVX/IkM1m/X6/uIgDhWmwFEXx+/2iqRxranFAqa4lSXAnnAMO7CGgk5ZnstyqrMtckyMe2rMkNVIhV4tT3a8+QIBEVm6ICPw0BUmizPc8gWDUIu/u7OysORvn2VTsGEilUrFYLBqNJhIJSZJobkSjUcN3Pc9i70a25uZm81S/GxWtpDLniworqc9WX1YSBWA2gC8p4mDDWC2qj+5Gf7PZLGK1wopAofHudr2L6Qs8OxdTQoN3ITpDLySutxq88iU8MiwWv4QaV0AVFiqsgEG0usADWMqynEnH8c/gRXOXCKRpGtV4UR4lsekuVbfMi+3t7YVca63Nl/lIzdk8CxXmJJGVwaKARQGLAquIAhYqrKLBtrpqUcCigEWBOSlgocKcJLIyWBSwKGBRYBVRwEKFVTTYVlctClgUsCgwJwUsVJiTRFYGiwIWBSwKrCIKWKiwigbb6qpFAYsCFgXmpICFCnOSyMpgUcCigEWBVUQBCxVW0WBbXbUoYFHAosCcFLBQYU4SWRksClgUsCiwiihgocIqGmyrqxYFLApYFJiTAhYqzEkiK4NFAYsCFgVWEQX+P7oELv+mrlsTAAAAAElFTkSuQmCC';

// --- Color Palette ---
const COLOR_PRIMARY = '#0077b6';
const COLOR_HEADER = '#03045e';
const COLOR_LIGHT = '#f8f9fa';
const COLOR_TEXT = '#212529';

export const generatePDF = async (analysis: ExcelAnalysis, fileName: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const rightX = pageWidth - margin;

      const imgW = 130; // mm — scaled width
      const imgH = (97 / 519) * imgW; // maintain aspect ratio

      
const imgX = (pageWidth - imgW) / 2; // center horizontally
const imgY = 15; // some margin from top






      // --- Font Setup ---
      doc.addFileToVFS('Amiri-Regular.ttf', amiriFontBase64);
      doc.addFont('Amiri-Regular.ttf', FONT_NAME, 'normal');
      doc.setFont(FONT_NAME, 'normal');
      doc.setFontSize(12);
      doc.setTextColor(COLOR_TEXT);

      // --- Add Logo Image ---
      if (logoBase64) {
        const imgProps = { x: margin, y: 10, width: 30, height: 30 };
        

        doc.addImage(`data:image/png;base64,${logoBase64}`, 'PNG', imgX, imgY, imgW, imgH);

      }

      let currentY = imgY + imgH + 5;
      // --- Header ---
      doc.setFontSize(11);
      doc.text(`الأكاديمية: ${analysis.region || 'غير متوفر'}`, rightX, currentY, { align: 'right' });
      currentY += 6;
      doc.text(`المديرية الإقليمية: ${analysis.directorate || 'غير متوفر'}`, rightX, currentY, { align: 'right' });
      currentY += 6;

      currentY += 10;

      // --- School Info ---
      doc.text(`المؤسسة: ${analysis.schoolName || 'غير متوفر'}`, margin, currentY, { align: 'left' });
      doc.text(`المستوى: ${analysis.level || 'غير متوفر'}`, margin, currentY + 7, { align: 'left' });
      doc.text(`الدورة: ${analysis.semester || 'غير متوفر'}`, rightX, currentY, { align: 'right' });
      doc.text(`المادة: ${analysis.subjectName || 'غير متوفر'}`, rightX, currentY + 7, { align: 'right' });

      currentY += 18;

      // --- Title Box ---
      doc.setFillColor(COLOR_PRIMARY);
      doc.setTextColor('#ffffff');
      doc.rect(margin, currentY, pageWidth - margin * 2, 10, 'F');
      doc.setFontSize(13);
      doc.text('تقرير حول الفرض المحروس', pageWidth / 2, currentY + 7, { align: 'center' });

      currentY += 15;

      // --- Exam Metadata Table ---
      autoTable(doc, {
        startY: currentY,
        head: [['تاريخ إنجاز الفرض', 'تاريخ تصحيح الفرض', 'محتوى الفرض']],
        body: [[
          analysis.examDate || 'غير متوفر',
          analysis.correctionDate || 'غير متوفر',
          analysis.subjectName || 'غير متوفر'
        ]],
        styles: {
          font: FONT_NAME,
          fontStyle: 'normal',
          fontSize: 10,
          halign: 'center',
        },
        headStyles: {
          fillColor: COLOR_PRIMARY,
          textColor: '#ffffff'
        },
        theme: 'grid'
      });

      // --- Result Summary Table ---
      const stats = analysis.finalScoreStats;

      autoTable(doc, {
        head: [[
          'عدد تلاميذ القسم',
          'عدد التلاميذ الحاصلين على المعدل',
          'عدد التلاميذ غير الحاصلين على المعدل',
          'أعلى نقطة',
          'أدنى نقطة',
          'معدل القسم'
        ]],
        body: [[
          analysis.studentCount || 'غير متوفر',
          stats.passCount,
          stats.failCount,
          stats.maxScore,
          stats.minScore,
          stats.averageScore.toFixed(2)
        ]],
        styles: {
          font: FONT_NAME,
          fontStyle: 'normal',
          fontSize: 10,
          halign: 'center',
        },
        headStyles: {
          fillColor: COLOR_PRIMARY,
          textColor: '#ffffff'
        },
        theme: 'grid'
      });

      // --- Top 3 Students Table ---
      const topStudents = (analysis.students || [])
        .sort((a, b) => parseFloat(b.firstExamScore || '0') - parseFloat(a.firstExamScore || '0'))
        .slice(0, 3)
        .map((s, i) => [
          (i + 1).toString(),
          s.studentName || '',
          s.firstExamScore || ''
        ]);

      if (topStudents.length) {
        autoTable(doc, {
          head: [['الترتيب', 'إسم التلميذ', 'النقطة']],
          body: topStudents,
          styles: {
            font: FONT_NAME,
            fontStyle: 'normal',
            fontSize: 10,
            halign: 'center',
          },
          headStyles: {
            fillColor: COLOR_LIGHT,
            textColor: COLOR_TEXT
          },
          theme: 'grid'
        });
      }

      // --- Score Breakdown ---
      const breakdown = analysis.scoreBreakdown;

      autoTable(doc, {
        head: [['0<n<5', '5<n<10', '10<n<15', '15<n<=20']],
        body: [[
          breakdown.range0to5,
          breakdown.range5to10,
          breakdown.range10to15,
          breakdown.range15to20
        ]],
        styles: {
          font: FONT_NAME,
          fontStyle: 'normal',
          fontSize: 10,
          halign: 'center',
        },
        headStyles: {
          fillColor: COLOR_PRIMARY,
          textColor: '#ffffff'
        },
        theme: 'grid'
      });

      // --- Success Rate Row ---
      autoTable(doc, {
        head: [['النسبة المئوية غير الحاصلين على المعدل', 'النسبة المئوية للحاصلين على المعدل']],
        body: [[
          stats.failPercentage.toFixed(2) + '%',
          stats.passPercentage.toFixed(2) + '%'
        ]],
        styles: {
          font: FONT_NAME,
          fontStyle: 'normal',
          fontSize: 10,
          halign: 'center',
        },
        headStyles: {
          fillColor: COLOR_PRIMARY,
          textColor: '#ffffff'
        },
        theme: 'grid'
      });

      // --- Footer ---
      const today = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.setTextColor(COLOR_TEXT);
      doc.text('الموسم الدراسي: 2024/2025', margin, 285, { align: 'left' });
      doc.text(`${today}`, rightX, 285, { align: 'right' });

      // Generate a meaningful filename
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const schoolName = analysis.schoolName?.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_') || 'school';
      const subject = analysis.subjectName?.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_') || 'subject';
      const level = analysis.level?.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_') || 'level';
      const semester = analysis.semester?.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_') || 'semester';

      const meaningfulFileName = `تقرير_فرض_${subject}_${level}_${semester}_${schoolName}_${date}.pdf`;

      doc.save(meaningfulFileName);
      resolve();
    } catch (error) {
      console.error('PDF generation error:', error);
      reject(error);
    }
  });
};
