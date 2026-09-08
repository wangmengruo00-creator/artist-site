window.MACHINE_REVIEW_20 =
[
  {
    "id": "T-027",
    "image": "../assets/invalidated-tickets/archive-items/food/t027.webp",
    "selection_reason": "No OCR text detected",
    "visible_record": "A faded, vertically oriented printed voucher. A large vertical denomination remains visible, but the smaller issuer and date lines are not confidently legible from this scan.",
    "assessment": "Productive omission",
    "relation": {
      "preserved": "The visual model registers it as a dark, vertical, bordered object and groups it with similarly formatted vouchers.",
      "altered": "No transcription was proposed, so the printed object is reduced to formal image properties.",
      "omitted": "All text, the vertical reading direction, denomination, seal and signs of age are absent from the OCR record.",
      "reconstructed": "Its relation to other records is created entirely through colour, border density and format rather than textual meaning."
    },
    "machine": {
      "ocr_text": "",
      "ocr_review_band": "no_text_detected",
      "ocr_confidence_mean": 0.0,
      "ocr_candidate_modes": [],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": []
    },
    "features": {
      "visual_cluster": 1,
      "cluster_silhouette": 0.3814391025150964,
      "visual_outlier_score": 1.505713543315047,
      "brightness_mean": 0.49783560633659363,
      "saturation_mean": 0.17338904738426208,
      "dark_fraction": 0.14867788461538461,
      "edge_density": 0.021818742156028748,
      "symmetry_horizontal": 0.9336211681365967,
      "symmetry_vertical": 0.9491507411003113,
      "light_fraction": 0.17029532967032968
    }
  },
  {
    "id": "T-001",
    "image": "../assets/invalidated-tickets/archive-items/food/t001.webp",
    "selection_reason": "Low-confidence OCR; possible service ticket",
    "visible_record": "A brown service ticket headed by an issuer line, with 理发票 as the central object type and a printed date line at the bottom; star-like border ornaments frame the ticket.",
    "assessment": "Core term preserved; ornament-to-text error",
    "relation": {
      "preserved": "The OCR retains 理发票 and fragments of the issuer/date structure.",
      "altered": "Most of the issuer and date are converted into incorrect repeated characters.",
      "omitted": "The figurative emblem, border pattern, paper tone and the distinction between ornament and writing are not described.",
      "reconstructed": "Decorative stars and degraded print appear to have been read as repeated language, producing text that is not visibly present."
    },
    "machine": {
      "ocr_text": "井飞终产终决齐源县饮食服务公司 專决再决决\n理发票 黟\n其方青产产共产产为一九七七午的肉內肉肉肉失內肉",
      "ocr_review_band": "low_confidence",
      "ocr_confidence_mean": 0.30000001192092896,
      "ocr_candidate_modes": [
        "service_or_payment"
      ],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": []
    },
    "features": {
      "visual_cluster": 1,
      "cluster_silhouette": 0.08572922224505501,
      "visual_outlier_score": 3.271403350669438,
      "brightness_mean": 0.5566909909248352,
      "saturation_mean": 0.34029173851013184,
      "dark_fraction": 0.06845561594202898,
      "edge_density": 0.021359436213970184,
      "symmetry_horizontal": 0.9482292532920837,
      "symmetry_vertical": 0.9522676467895508,
      "light_fraction": 0.1989356884057971
    }
  },
  {
    "id": "T-024",
    "image": "../assets/invalidated-tickets/archive-items/food/t024.webp",
    "selection_reason": "Low-confidence OCR; unresolved object type",
    "visible_record": "A photograph of several stacked banknotes rather than one isolated object. The upper note visibly reads 中国人民银行, 壹分 and 一九五三年.",
    "assessment": "Segmentation failure and transcription failure",
    "relation": {
      "preserved": "The OCR detects three text zones and approximately retains the denomination structure.",
      "altered": "The highly legible banknote text is substantially misrecognised.",
      "omitted": "The presence of multiple overlapping notes and the vehicle illustration are not represented.",
      "reconstructed": "The pipeline treats the photograph as a single archival object even though the visible material unit contains several notes."
    },
    "machine": {
      "ocr_text": "中國心民銀村\n冚入耀\n晏分",
      "ocr_review_band": "low_confidence",
      "ocr_confidence_mean": 0.30000001192092896,
      "ocr_candidate_modes": [],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": []
    },
    "features": {
      "visual_cluster": 3,
      "cluster_silhouette": 0.37983258180145785,
      "visual_outlier_score": 2.1668451667134696,
      "brightness_mean": 0.6760534644126892,
      "saturation_mean": 0.41037535667419434,
      "dark_fraction": 0.06354166666666666,
      "edge_density": 0.03159135952591896,
      "symmetry_horizontal": 0.9023326635360718,
      "symmetry_vertical": 0.8784492611885071,
      "light_fraction": 0.1913135593220339
    }
  },
  {
    "id": "T-054",
    "image": "../assets/invalidated-tickets/archive-items/food/t054.webp",
    "selection_reason": "Low-confidence OCR; grain-ticket candidate",
    "visible_record": "贵州省地方粮票, 拾市斤, with 1977 printed below the denomination and an architectural image on the right.",
    "assessment": "One-character error changes classification",
    "relation": {
      "preserved": "Province and denomination are retained.",
      "altered": "粮票 is changed to 積票.",
      "omitted": "The visible year 1977 and the architectural illustration are not extracted.",
      "reconstructed": "Because the key object-type character is altered, the keyword classifier fails to propose the grain-ticket mode despite other supporting evidence."
    },
    "machine": {
      "ocr_text": "贵州省地方積票\n拾市斤\n10",
      "ocr_review_band": "low_confidence",
      "ocr_confidence_mean": 0.30000001192092896,
      "ocr_candidate_modes": [],
      "ocr_place_candidates": [
        "贵州"
      ],
      "ocr_measurement_candidates": [
        "拾市斤"
      ]
    },
    "features": {
      "visual_cluster": 3,
      "cluster_silhouette": 0.3632318414747019,
      "visual_outlier_score": 1.8235192986311222,
      "brightness_mean": 0.6847556829452515,
      "saturation_mean": 0.29554903507232666,
      "dark_fraction": 0.052780172413793104,
      "edge_density": 0.038093775510787964,
      "symmetry_horizontal": 0.9104025363922119,
      "symmetry_vertical": 0.8875235319137573,
      "light_fraction": 0.17252155172413794
    }
  },
  {
    "id": "T-075",
    "image": "../assets/invalidated-tickets/archive-items/food/t075.webp",
    "selection_reason": "Low-confidence OCR; date and unit ambiguity",
    "visible_record": "A single photograph contains at least two separate 黑龙江省粮票 objects with different denominations, colours and dates.",
    "assessment": "Multi-object merge",
    "relation": {
      "preserved": "The OCR detects 黑龙江省粮票 and fragments of denominations and numbers from both objects.",
      "altered": "Several unit and date characters are incorrect.",
      "omitted": "The boundary between the two physical tickets and the transparent storage sleeve are not encoded.",
      "reconstructed": "Text from distinct objects is merged into one machine record, creating false numerical combinations."
    },
    "machine": {
      "ocr_text": "黑龙江省粮票\n飯析斤\n1097\n龙江炒\n4970\n壹市呀\n01",
      "ocr_review_band": "low_confidence",
      "ocr_confidence_mean": 0.30000001192092896,
      "ocr_candidate_modes": [
        "grain_or_food_allocation"
      ],
      "ocr_place_candidates": [
        "黑龙江"
      ],
      "ocr_measurement_candidates": []
    },
    "features": {
      "visual_cluster": 5,
      "cluster_silhouette": 0.1038453336772296,
      "visual_outlier_score": 2.6483977582657916,
      "brightness_mean": 0.7710294127464294,
      "saturation_mean": 0.1468934565782547,
      "dark_fraction": 0.014010989010989012,
      "edge_density": 0.04283009469509125,
      "symmetry_horizontal": 0.8419052362442017,
      "symmetry_vertical": 0.8379422426223755,
      "light_fraction": 0.3902815934065934
    }
  },
  {
    "id": "T-006",
    "image": "../assets/invalidated-tickets/archive-items/food/t006.webp",
    "selection_reason": "Highest visual-outlier score",
    "visible_record": "A saturated green ticket issued by 许昌市食品总厂, with 壹分 as the dominant denomination and a central food-related emblem.",
    "assessment": "Useful visual pairing; weak semantic reading",
    "relation": {
      "preserved": "The denomination 壹分 is read correctly.",
      "altered": "The issuer line is heavily distorted.",
      "omitted": "The emblem and the relation between red lettering and green ground are not semantically described.",
      "reconstructed": "It becomes the corpus's strongest visual outlier but is paired with T-007 because their format and colour structure are nearly identical."
    },
    "machine": {
      "ocr_text": "涉最班食品越了，\n壹\n分",
      "ocr_review_band": "medium_confidence",
      "ocr_confidence_mean": 0.600000003973643,
      "ocr_candidate_modes": [],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": []
    },
    "features": {
      "visual_cluster": 4,
      "cluster_silhouette": 0.2951793589938276,
      "visual_outlier_score": 11.275921715233979,
      "brightness_mean": 0.47409260272979736,
      "saturation_mean": 0.6024177074432373,
      "dark_fraction": 0.6801432291666667,
      "edge_density": 0.01841745898127556,
      "symmetry_horizontal": 0.9479233026504517,
      "symmetry_vertical": 0.9338040351867676,
      "light_fraction": 0.19915364583333334
    }
  },
  {
    "id": "T-007",
    "image": "../assets/invalidated-tickets/archive-items/food/t007.webp",
    "selection_reason": "Paired visual outlier",
    "visible_record": "A saturated blue ticket issued by 许昌市食品总厂, with 叁分 as the dominant denomination and the same central emblem as T-006.",
    "assessment": "Strong formal relation, unverified historical relation",
    "relation": {
      "preserved": "The denomination 叁分 is read correctly.",
      "altered": "The issuer is garbled despite being visually comparable to T-006.",
      "omitted": "The series relationship expressed through repeated layout and emblem is not named by OCR.",
      "reconstructed": "The visual model correctly makes T-006 its nearest neighbour, while both remain outliers relative to the wider corpus."
    },
    "machine": {
      "ocr_text": "許區市食家总工！\n叁\n分",
      "ocr_review_band": "higher_confidence_not_verified",
      "ocr_confidence_mean": 0.7666666706403097,
      "ocr_candidate_modes": [],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": []
    },
    "features": {
      "visual_cluster": 4,
      "cluster_silhouette": 0.3225476665107512,
      "visual_outlier_score": 11.275921715233979,
      "brightness_mean": 0.5873323678970337,
      "saturation_mean": 0.5749460458755493,
      "dark_fraction": 0.6075399709302326,
      "edge_density": 0.01566898263990879,
      "symmetry_horizontal": 0.9573979377746582,
      "symmetry_vertical": 0.9524387717247009,
      "light_fraction": 0.3358466569767442
    }
  },
  {
    "id": "T-137",
    "image": "../assets/invalidated-tickets/archive-items/food/t137.webp",
    "selection_reason": "High visual-outlier score",
    "visible_record": "A 工农兵晶体管收音机购货券 with a Mao quotation, radio illustration, dotted field and the instruction 盖章有效／过期作废.",
    "assessment": "Reading hierarchy differs from object function",
    "relation": {
      "preserved": "Much of the quotation, 工农兵, 收音机 and the validity instruction are detected.",
      "altered": "晶体管 and several quotation characters are misread.",
      "omitted": "The prominent object type 购货券 is not retained in the OCR output, and the radio illustration is not semantically recorded.",
      "reconstructed": "The machine foregrounds ideologically prominent text while missing the small but functionally decisive classification term."
    },
    "machine": {
      "ocr_text": "工\n毛主席语录\n領导我們事\n业的核心力量受\n中国共产党。\n指尋我們是\n證的理淪基融髮\n馬克思列宁品义\n工衣兵\nGONG NONG BING\n品仲管\n收音机\n00\n北路芜熊电三广\n盖章有效\n过期作废",
      "ocr_review_band": "medium_confidence",
      "ocr_confidence_mean": 0.45000000670552254,
      "ocr_candidate_modes": [],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": []
    },
    "features": {
      "visual_cluster": 2,
      "cluster_silhouette": 0.017082552338225667,
      "visual_outlier_score": 9.93320864996862,
      "brightness_mean": 0.7321080565452576,
      "saturation_mean": 0.22533293068408966,
      "dark_fraction": 0.1264968487394958,
      "edge_density": 0.046043723821640015,
      "symmetry_horizontal": 0.6621477603912354,
      "symmetry_vertical": 0.9063659310340881,
      "light_fraction": 0.44256827731092435
    }
  },
  {
    "id": "T-089",
    "image": "../assets/invalidated-tickets/archive-items/food/t089.webp",
    "selection_reason": "High visual-outlier score",
    "visible_record": "淄博市细粮票, 贰仟伍佰克（2.5公斤）, dated 1991, with a train image.",
    "assessment": "Strong OCR; weak visual-cluster fit",
    "relation": {
      "preserved": "Issuer, grain-ticket type, principal denomination and year are mostly retained.",
      "altered": "The parenthetical metric value is garbled.",
      "omitted": "The train illustration and its possible relation to regional modernisation are outside the OCR record.",
      "reconstructed": "It is marked as visually anomalous despite being semantically legible, showing a conflict between textual and formal similarity."
    },
    "machine": {
      "ocr_text": "淄博市細粮票\n2500\n贰仟伍佰克\n182--公5\n2500\n1991",
      "ocr_review_band": "medium_confidence",
      "ocr_confidence_mean": 0.7166666686534882,
      "ocr_candidate_modes": [
        "grain_or_food_allocation"
      ],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": [
        "贰仟伍佰克"
      ]
    },
    "features": {
      "visual_cluster": 2,
      "cluster_silhouette": -0.03586407931995964,
      "visual_outlier_score": 7.193183690517343,
      "brightness_mean": 0.759351372718811,
      "saturation_mean": 0.13284799456596375,
      "dark_fraction": 0.07855738993710693,
      "edge_density": 0.057289205491542816,
      "symmetry_horizontal": 0.8776693344116211,
      "symmetry_vertical": 0.8526244163513184,
      "light_fraction": 0.33596698113207546
    }
  },
  {
    "id": "T-132",
    "image": "../assets/invalidated-tickets/archive-items/food/t132.webp",
    "selection_reason": "High visual-outlier score",
    "visible_record": "A scenic admission ticket with a four-character title arranged in an older directional layout and the clearly visible price 伍元.",
    "assessment": "Directional reading conflict",
    "relation": {
      "preserved": "The four title characters and 票价伍元 are detected.",
      "altered": "The OCR follows the characters' left-to-right spatial order; the intended historical reading may run right-to-left.",
      "omitted": "Reading direction, scenic illustration and the partial neighbouring ticket visible at the top are not encoded.",
      "reconstructed": "A spatial transcription becomes a proposed linguistic order, demonstrating that OCR directionality is interpretive rather than neutral."
    },
    "machine": {
      "ocr_text": "雲岫古庵\n票价 伍元",
      "ocr_review_band": "low_confidence",
      "ocr_confidence_mean": 0.30000001192092896,
      "ocr_candidate_modes": [],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": []
    },
    "features": {
      "visual_cluster": 2,
      "cluster_silhouette": -0.07219833900397125,
      "visual_outlier_score": 6.70579055062663,
      "brightness_mean": 0.7717851996421814,
      "saturation_mean": 0.5002018213272095,
      "dark_fraction": 0.2082419590643275,
      "edge_density": 0.06115628033876419,
      "symmetry_horizontal": 0.8605300188064575,
      "symmetry_vertical": 0.8343961238861084,
      "light_fraction": 0.2793494152046784
    }
  },
  {
    "id": "T-103",
    "image": "../assets/invalidated-tickets/archive-items/food/t103.webp",
    "selection_reason": "Higher-confidence grain-ticket reading",
    "visible_record": "吉林省地方粮票, 叁市斤, dated 1975, with a building and cars.",
    "assessment": "Accurate core, incomplete record",
    "relation": {
      "preserved": "Issuer, object type and denomination are transcribed accurately.",
      "altered": "No major alteration in the extracted core text.",
      "omitted": "The visible year 1975 and illustration are absent from the OCR summary.",
      "reconstructed": "High OCR confidence could imply completion even though a clearly visible date remains missing."
    },
    "machine": {
      "ocr_text": "吉林省地方粮票\n叁市斤",
      "ocr_review_band": "higher_confidence_not_verified",
      "ocr_confidence_mean": 1.0,
      "ocr_candidate_modes": [
        "grain_or_food_allocation"
      ],
      "ocr_place_candidates": [
        "吉林"
      ],
      "ocr_measurement_candidates": [
        "叁市斤"
      ]
    },
    "features": {
      "visual_cluster": 3,
      "cluster_silhouette": 0.2737120377573313,
      "visual_outlier_score": 2.3735803892970866,
      "brightness_mean": 0.7305202484130859,
      "saturation_mean": 0.22835566103458405,
      "dark_fraction": 0.039732142857142855,
      "edge_density": 0.03091861680150032,
      "symmetry_horizontal": 0.8953514099121094,
      "symmetry_vertical": 0.891924262046814,
      "light_fraction": 0.3400669642857143
    }
  },
  {
    "id": "T-118",
    "image": "../assets/invalidated-tickets/archive-items/food/t118.webp",
    "selection_reason": "Higher-confidence dated allocation record",
    "visible_record": "上海市粮食局鲜蛋饲料票, 1992年, 宝山区, 50公斤, with a year-use/expiry instruction and stamps.",
    "assessment": "Strong transcription; temporal layers flattened",
    "relation": {
      "preserved": "The main wording, location, date, quantity and validity instruction are accurately retained.",
      "altered": "No major alteration is evident in the core OCR string.",
      "omitted": "Stamped marks, illustration, paper wear and their status as later material traces are not distinguished.",
      "reconstructed": "The OCR presents printed and stamped elements in one textual stream, flattening different moments of inscription."
    },
    "machine": {
      "ocr_text": "上海市粮食局鲜蛋饲料票\n1992年\n宝山区\n50公斤\n年内使用 过期作废",
      "ocr_review_band": "higher_confidence_not_verified",
      "ocr_confidence_mean": 0.9,
      "ocr_candidate_modes": [
        "grain_or_food_allocation"
      ],
      "ocr_place_candidates": [
        "上海"
      ],
      "ocr_measurement_candidates": [
        "50公斤"
      ]
    },
    "features": {
      "visual_cluster": 5,
      "cluster_silhouette": 0.15147435275063184,
      "visual_outlier_score": 2.671249605274651,
      "brightness_mean": 0.7634395360946655,
      "saturation_mean": 0.1599234938621521,
      "dark_fraction": 0.03740482233502538,
      "edge_density": 0.05235107243061066,
      "symmetry_horizontal": 0.8846683502197266,
      "symmetry_vertical": 0.8498438596725464,
      "light_fraction": 0.27001903553299494
    }
  },
  {
    "id": "T-120",
    "image": "../assets/invalidated-tickets/archive-items/food/t120.webp",
    "selection_reason": "Higher-confidence supply-certificate reading",
    "visible_record": "梅溪区供销社煤油供应证, 一九七八年, with an unfilled month field.",
    "assessment": "Text preserved; blankness lost",
    "relation": {
      "preserved": "The issuer, object type and Chinese-numeral year are accurately retained and normalised to 1978.",
      "altered": "No major character error in the core reading.",
      "omitted": "The blank month field is not represented as an evidential absence.",
      "reconstructed": "The machine records the label 月 but not the meaningful condition that no month was entered."
    },
    "machine": {
      "ocr_text": "梅溪区供销社\n煤油供应证\n一九七八年\n月",
      "ocr_review_band": "higher_confidence_not_verified",
      "ocr_confidence_mean": 1.0,
      "ocr_candidate_modes": [
        "commodity_or_ration"
      ],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": []
    },
    "features": {
      "visual_cluster": 2,
      "cluster_silhouette": -0.1633153253398626,
      "visual_outlier_score": 3.109164202888464,
      "brightness_mean": 0.7957715392112732,
      "saturation_mean": 0.14325280487537384,
      "dark_fraction": 0.05739182692307692,
      "edge_density": 0.05126189440488815,
      "symmetry_horizontal": 0.8600419163703918,
      "symmetry_vertical": 0.868224024772644,
      "light_fraction": 0.26876502403846153
    }
  },
  {
    "id": "T-122",
    "image": "../assets/invalidated-tickets/archive-items/food/t122.webp",
    "selection_reason": "Higher-confidence fuel-ticket reading",
    "visible_record": "A 2001 总后勤部物资油料部军用柴油票 for 壹拾升, with detachable stub, vehicle fields, serial number and stamp area.",
    "assessment": "Strong OCR; form logic flattened",
    "relation": {
      "preserved": "The object type, issuing body, quantity, year, serial number and most form fields are retained.",
      "altered": "清票专用章 may conflate a printed/stamped area, and line order follows OCR detection rather than form hierarchy.",
      "omitted": "The perforation, detachable-stub logic and blank vehicle fields are not represented.",
      "reconstructed": "A structured operational form becomes a flat sequence of text lines."
    },
    "machine": {
      "ocr_text": "存根\n车型\n车号\n加油员盖章\n0126666\n月/日\n柴油\n总后勤部物资油料部\n军用柴油票\n10\n清票专用章\n地方单位车辆无效\n壹拾升\n0126666\n2001",
      "ocr_review_band": "higher_confidence_not_verified",
      "ocr_confidence_mean": 0.8400000015894572,
      "ocr_candidate_modes": [
        "commodity_or_ration"
      ],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": [
        "壹拾升"
      ]
    },
    "features": {
      "visual_cluster": 2,
      "cluster_silhouette": -0.09379258805703618,
      "visual_outlier_score": 3.994807671108552,
      "brightness_mean": 0.8949600458145142,
      "saturation_mean": 0.12799030542373657,
      "dark_fraction": 0.0007283834586466165,
      "edge_density": 0.047416359186172485,
      "symmetry_horizontal": 0.8986968398094177,
      "symmetry_vertical": 0.877604603767395,
      "light_fraction": 0.7203947368421053
    }
  },
  {
    "id": "T-083",
    "image": "../assets/invalidated-tickets/archive-items/food/t083.webp",
    "selection_reason": "Higher-confidence grain-ticket reading",
    "visible_record": "淄博市粗粮票, 伍佰克（壹市斤）, dated 1990, with an agricultural machinery illustration.",
    "assessment": "High-confidence unit error",
    "relation": {
      "preserved": "Issuer, ticket type and 伍佰克 are retained.",
      "altered": "壹市斤 is read as 壹市厅.",
      "omitted": "The visible year 1990 and agricultural image are not extracted.",
      "reconstructed": "A single character substitution turns a unit into a non-unit while the record remains relatively high-confidence."
    },
    "machine": {
      "ocr_text": "淄博市粗粮票\n粗\n伍佰克\n（壹市厅）",
      "ocr_review_band": "higher_confidence_not_verified",
      "ocr_confidence_mean": 0.8250000029802322,
      "ocr_candidate_modes": [
        "grain_or_food_allocation"
      ],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": [
        "伍佰克"
      ]
    },
    "features": {
      "visual_cluster": 2,
      "cluster_silhouette": -0.1946660371162121,
      "visual_outlier_score": 3.5323640592693444,
      "brightness_mean": 0.7487485408782959,
      "saturation_mean": 0.13288331031799316,
      "dark_fraction": 0.04600694444444445,
      "edge_density": 0.05687946081161499,
      "symmetry_horizontal": 0.8839244842529297,
      "symmetry_vertical": 0.8286892175674438,
      "light_fraction": 0.3375217013888889
    }
  },
  {
    "id": "T-012",
    "image": "../assets/invalidated-tickets/archive-items/food/t012.webp",
    "selection_reason": "Transport-mode boundary case",
    "visible_record": "北京地下铁道换乘车票, with lines 1/2 transfer use, a 五元 reimbursement value, serial 039457 and a train/station illustration.",
    "assessment": "Correct functional mode; partial small-print error",
    "relation": {
      "preserved": "The main ticket type, Beijing, transfer function, value and serial number are retained.",
      "altered": "Several small-print instruction characters are incorrect.",
      "omitted": "The train/station illustration, stains and the distinction between main ticket and blue 副券 field are not fully described.",
      "reconstructed": "The keyword protocol correctly proposes transport, while its visual cluster is based on pale layout rather than mobility function."
    },
    "machine": {
      "ocr_text": "北京地下铁道换乘车票\n请日觉遵可地铁现定\n定擎车票本绞\n当日换素有效\nA.358\n039457\n伍元 报销凭证\n1号线、2号线\n萊车专用",
      "ocr_review_band": "medium_confidence",
      "ocr_confidence_mean": 0.47777778572506374,
      "ocr_candidate_modes": [
        "transport"
      ],
      "ocr_place_candidates": [
        "北京"
      ],
      "ocr_measurement_candidates": []
    },
    "features": {
      "visual_cluster": 5,
      "cluster_silhouette": 0.2028964328625239,
      "visual_outlier_score": 3.2190851932576052,
      "brightness_mean": 0.81614750623703,
      "saturation_mean": 0.20045605301856995,
      "dark_fraction": 0.0013731060606060606,
      "edge_density": 0.039121273905038834,
      "symmetry_horizontal": 0.848739743232727,
      "symmetry_vertical": 0.887797474861145,
      "light_fraction": 0.35890151515151514
    }
  },
  {
    "id": "T-008",
    "image": "../assets/invalidated-tickets/archive-items/food/t008.webp",
    "selection_reason": "Admission-ticket boundary case",
    "visible_record": "文化宫电影院入场券, single-number format, 25排17座, number 311, 乙3, with 当场有效／残票作废 and 副券.",
    "assessment": "Good object identification; reading sequence flattened",
    "relation": {
      "preserved": "The cinema, admission function, number, validity instruction and stub are mostly retained.",
      "altered": "排 is misread inside the seat reference and one validity character is altered.",
      "omitted": "The narrow vertical format, red/black hierarchy and torn-paper condition are not semantically recorded.",
      "reconstructed": "The admission classification is useful, but the OCR line sequence does not reproduce how the ticket guides a reader from venue to seat to validity."
    },
    "machine": {
      "ocr_text": "文化宫电影院\n单号\n25拂17座\n311\n入场券\n乙\n3\n当场有效残票作废\n副券",
      "ocr_review_band": "medium_confidence",
      "ocr_confidence_mean": 0.6222222248713175,
      "ocr_candidate_modes": [
        "admission_or_event"
      ],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": []
    },
    "features": {
      "visual_cluster": 2,
      "cluster_silhouette": -0.07254583964141613,
      "visual_outlier_score": 3.109164202888464,
      "brightness_mean": 0.8301823735237122,
      "saturation_mean": 0.15670183300971985,
      "dark_fraction": 0.06512019230769231,
      "edge_density": 0.058021340519189835,
      "symmetry_horizontal": 0.8987818956375122,
      "symmetry_vertical": 0.8589258193969727,
      "light_fraction": 0.4103125
    }
  },
  {
    "id": "T-047",
    "image": "../assets/invalidated-tickets/archive-items/food/t047.webp",
    "selection_reason": "Commodity/ration boundary case",
    "visible_record": "巢湖市定点油票, 贰佰伍拾克（半市斤）, dated 一九九〇, with a cooking-oil container illustration.",
    "assessment": "Strong positive control",
    "relation": {
      "preserved": "Issuer, object type, both quantity systems and Chinese-numeral year are accurately retained and normalised.",
      "altered": "No major alteration is evident in the core reading.",
      "omitted": "The illustration and decorative security pattern are not represented.",
      "reconstructed": "Keyword classification proposes commodity/ration, but does not distinguish allocation rule, commodity type and redemption context."
    },
    "machine": {
      "ocr_text": "250\n巢湖市定点油票\n贰佰伍拾克\n（半市斤）一九九〇\n250",
      "ocr_review_band": "higher_confidence_not_verified",
      "ocr_confidence_mean": 0.8600000023841858,
      "ocr_candidate_modes": [
        "commodity_or_ration"
      ],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": [
        "半市斤",
        "贰佰伍拾克"
      ]
    },
    "features": {
      "visual_cluster": 2,
      "cluster_silhouette": -0.10432241103674891,
      "visual_outlier_score": 4.393585103793741,
      "brightness_mean": 0.8040091395378113,
      "saturation_mean": 0.0874081403017044,
      "dark_fraction": 0.03720637583892617,
      "edge_density": 0.05529707297682762,
      "symmetry_horizontal": 0.8916164636611938,
      "symmetry_vertical": 0.860093891620636,
      "light_fraction": 0.5572357382550336
    }
  },
  {
    "id": "T-094",
    "image": "../assets/invalidated-tickets/archive-items/food/t094.webp",
    "selection_reason": "Meat-ticket boundary case",
    "visible_record": "郫县猪肉票, 贰市斤, dated 1979, with a green landscape/agricultural illustration and a red stamp.",
    "assessment": "Accurate but materially thin reading",
    "relation": {
      "preserved": "Object type and denomination are accurately retained.",
      "altered": "No major alteration in the short OCR string.",
      "omitted": "The visible year, stamp, illustration and material condition are absent.",
      "reconstructed": "A short accurate phrase may look complete while most of the object's temporal and material evidence remains unread."
    },
    "machine": {
      "ocr_text": "郫县猪肉票\n贰市斤",
      "ocr_review_band": "low_confidence",
      "ocr_confidence_mean": 0.30000001192092896,
      "ocr_candidate_modes": [
        "commodity_or_ration"
      ],
      "ocr_place_candidates": [],
      "ocr_measurement_candidates": [
        "贰市斤"
      ]
    },
    "features": {
      "visual_cluster": 5,
      "cluster_silhouette": 0.1414007657831546,
      "visual_outlier_score": 1.8201010971006797,
      "brightness_mean": 0.790185272693634,
      "saturation_mean": 0.20497329533100128,
      "dark_fraction": 0.04754723837209302,
      "edge_density": 0.03830186650156975,
      "symmetry_horizontal": 0.9047604203224182,
      "symmetry_vertical": 0.8550529479980469,
      "light_fraction": 0.3079760174418605
    }
  },
  {
    "id": "T-002",
    "image": "../assets/invalidated-tickets/archive-items/food/t002.webp",
    "selection_reason": "Commodity/allocation boundary case",
    "visible_record": "江苏省结婚补助棉胎专用券, 高邮, 1983, with a large central double-happiness character and an official stamp.",
    "assessment": "Ontology omission rather than OCR failure",
    "relation": {
      "preserved": "The main phrase, place and year are largely retained.",
      "altered": "Secondary repeated text is garbled into 江惹省／絮椲票／臺用華.",
      "omitted": "The central double-happiness symbol, stamp and the social condition of marriage-linked eligibility are not captured by the current keyword protocol.",
      "reconstructed": "Because the rules do not include 棉胎 or marriage subsidy, a relatively accurate OCR record receives no candidate mode."
    },
    "machine": {
      "ocr_text": "江苏省结婚补助棉胎\n券\n江惹省\n絮椲票\n臺用華\n高邮\n1983",
      "ocr_review_band": "medium_confidence",
      "ocr_confidence_mean": 0.6000000068119594,
      "ocr_candidate_modes": [],
      "ocr_place_candidates": [
        "江苏"
      ],
      "ocr_measurement_candidates": []
    },
    "features": {
      "visual_cluster": 5,
      "cluster_silhouette": 0.06811311477043931,
      "visual_outlier_score": 3.6761748597415846,
      "brightness_mean": 0.78520268201828,
      "saturation_mean": 0.2559621334075928,
      "dark_fraction": 0.021927966101694917,
      "edge_density": 0.04183629900217056,
      "symmetry_horizontal": 0.9108297824859619,
      "symmetry_vertical": 0.8865064978599548,
      "light_fraction": 0.1814353813559322
    }
  }
]
;
